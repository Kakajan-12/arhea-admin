'use client';
import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import axios from 'axios';
import Sidebar from "@/Components/Sidebar";
import TokenTimer from "@/Components/TokenTimer";
import {DocumentIcon} from "@heroicons/react/16/solid";
import Image from "next/image";

const EditTeam = () => {
    const {id} = useParams();
    const router = useRouter();

    type Data = {
        name_tk: string;
        name_en: string;
        name_ru: string;
        position_tk: string;
        position_en: string;
        position_ru: string;
        image: string;
    };

    const [data, setData] = useState<Data>({
        name_tk: '',
        name_en: '',
        name_ru: '',
        position_tk: '',
        position_en: '',
        position_ru: '',
        image: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    router.push('/');
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('API Response:', response.data);

                if (response.data && response.data.length > 0) {
                    const teamData = response.data[0];

                    console.log('Team data (first element):', teamData);

                    setData({
                        name_tk: teamData.name_tk || '',
                        name_en: teamData.name_en || '',
                        name_ru: teamData.name_ru || '',
                        position_tk: teamData.position_tk || '',
                        position_en: teamData.position_en || '',
                        position_ru: teamData.position_ru || '',
                        image: teamData.image || '',
                    });

                    setLoading(false);
                } else {
                    throw new Error("Данные не найдены");
                }
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setError('Ошибка при загрузке данных');
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 404) {
                        setError('Запись не найдена');
                    } else if (err.response?.status === 401) {
                        router.push('/');
                    }
                }
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/');
                return;
            }

            const formData = new FormData();
            formData.append('name_tk', data.name_tk);
            formData.append('name_en', data.name_en);
            formData.append('name_ru', data.name_ru);
            formData.append('position_tk', data.position_tk);
            formData.append('position_en', data.position_en);
            formData.append('position_ru', data.position_ru);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/team/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            router.push('/admin/team');
        } catch (err) {
            console.error('Ошибка при сохранении:', err);
            setError('Ошибка при сохранении данных');
        }
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '/placeholder.jpg';
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
    };

    if (loading) {
        return (
            <div className="flex bg-gray-50 min-h-screen">
                <Sidebar/>
                <div className="flex-1 p-6 ml-64 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Загрузка данных...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar/>
            <div className="flex-1 p-6 ml-64">
                <TokenTimer/>

                <div className="mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit team</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        {data.image && (
                            <div className="mb-6">
                                <label className="block font-semibold text-gray-700 mb-3">Current image</label>
                                <div className="flex items-start space-x-4">
                                    <div className="relative w-40 h-40">
                                        <Image
                                            src={getImageUrl(data.image)}
                                            alt="Team member"
                                            className="object-cover rounded-lg border border-gray-300"
                                            fill
                                            sizes="160px"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-2">
                                            File: {data.image.split(/[\\/]/).pop() || data.image}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            To save the current image, do not select a new file.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <label htmlFor="image" className="block font-semibold text-gray-700 mb-3">
                                {data.image ? 'Replace image' : 'Upload image'}
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                    } else {
                                        setImageFile(null);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-lg file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-blue-50 file:text-blue-700
                                          hover:file:bg-blue-100"
                            />
                            {imageFile && (
                                <p className="mt-2 text-sm text-green-600">
                                    A new file has been selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Turkmen</h3>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Name:</label>
                                <input
                                    value={data.name_tk}
                                    onChange={(e) => setData({...data, name_tk: e.target.value})}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name in Turkmen"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Position:</label>
                                <input
                                    value={data.position_tk}
                                    onChange={(e) => setData({...data, position_tk: e.target.value})}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your position in Turkmen"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">English</h3>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Name:</label>
                                <input
                                    value={data.name_en}
                                    onChange={(e) => setData({...data, name_en: e.target.value})}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name in English"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Position:</label>
                                <input
                                    value={data.position_en}
                                    onChange={(e) => setData({...data, position_en: e.target.value})}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your position in English"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Russian</h3>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Name:</label>
                                <input
                                    value={data.name_ru}
                                    onChange={(e) => setData({...data, name_ru: e.target.value})}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name in Russian"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Position:</label>
                                <input
                                    value={data.position_ru}
                                    onChange={(e) => setData({...data, position_ru: e.target.value})}
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your position in Russian"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t flex space-x-4">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center bg text-white font-medium py-3 px-6 rounded-lg transition-colors flex-1 cursor-pointer"
                            >
                                <DocumentIcon className="w-5 h-5 mr-2"/>
                                Save changes
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/team')}
                                className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex-1 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTeam;