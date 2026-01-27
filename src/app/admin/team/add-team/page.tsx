'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Sidebar from '@/Components/Sidebar';
import TokenTimer from '@/Components/TokenTimer';

const AddTeam = () => {
    const [image, setImage] = useState<File | null>(null);
    const [name_tk, setNameTk] = useState('');
    const [name_en, setNameEn] = useState('');
    const [name_ru, setNameRu] = useState('');
    const [position_tk, setPositionTk] = useState('');
    const [position_en, setPositionEn] = useState('');
    const [position_ru, setPositionRu] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('Нет токена. Пользователь не авторизован.');
            return;
        }

        const formData = new FormData();
        if (image) formData.append('image', image);
        formData.append('name_tk', name_tk ?? '');
        formData.append('name_en', name_en ?? '');
        formData.append('name_ru', name_ru ?? '');
        formData.append('position_tk', position_tk ?? '');
        formData.append('position_en', position_en ?? '');
        formData.append('position_ru', position_ru ?? '');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('добавлен!', data);
                setImage(null);
                setNameTk('');
                setNameEn('');
                setNameRu('');
                setPositionTk('');
                setPositionEn('');
                setPositionRu('');
                router.push('/admin/team');
            } else {
                const errorText = await response.text();
                console.error('Ошибка при добавлении:', errorText);
            }
        } catch (error) {
            console.error('Ошибка запроса', error);
        }
    };

    return (
        <div className="flex bg-gray-200">
            <Sidebar/>
            <div className="flex-1 p-10 ml-62">
                <TokenTimer/>
                <div className="mt-8">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-left">Add team</h2>

                        <div className="mb-4 flex space-x-4">
                            <div className="w-full">
                                <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
                                    Image:
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImage(e.target.files[0]);
                                        }
                                    }}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
                                />
                            </div>

                        </div>
                        <div className="py-4">
                            <h4 className="mb-4 font-bold text-xl">Turkmen</h4>
                            <div className="flex w-full space-x-4">
                                <div className="mb-4 w-full">
                                    <label className="block text-gray-700 font-semibold mb-2">Name:</label>
                                    <input
                                        value={name_tk}
                                        onChange={(e) => setNameTk(e.target.value)}
                                        type="text"
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-gray-700 font-semibold mb-2">Position:</label>
                                    <input
                                        value={position_tk}
                                        onChange={(e) => setPositionTk(e.target.value)}
                                        type="text"
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <h4 className="mb-4 font-bold text-xl">English</h4>
                            <div className="flex w-full space-x-4">
                                <div className="mb-4 w-full">
                                    <label className="block text-gray-700 font-semibold mb-2">Name:</label>
                                    <input
                                        value={name_en}
                                        onChange={(e) => setNameEn(e.target.value)}
                                        type="text"
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-gray-700 font-semibold mb-2">Position:</label>
                                    <input
                                        value={position_en}
                                        onChange={(e) => setPositionEn(e.target.value)}
                                        type="text"
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <h4 className="mb-4 font-bold text-xl">Russian</h4>
                            <div className="flex w-full space-x-4">
                                <div className="mb-4 w-full">
                                    <label className="block text-gray-700 font-semibold mb-2">Name:</label>
                                    <input
                                        value={name_ru}
                                        onChange={(e) => setNameRu(e.target.value)}
                                        type="text"
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-gray-700 font-semibold mb-2">Position:</label>
                                    <input
                                        value={position_ru}
                                        onChange={(e) => setPositionRu(e.target.value)}
                                        type="text"
                                        required
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                        >
                            Add team
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTeam;
