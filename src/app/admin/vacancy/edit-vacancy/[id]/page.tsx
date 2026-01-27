'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import TipTapEditor from '@/Components/TipTapEditor';
import Sidebar from '@/Components/Sidebar';
import TokenTimer from '@/Components/TokenTimer';
import { DocumentIcon } from '@heroicons/react/16/solid';

type VacancyData = {
    title_tk: string;
    title_en: string;
    title_ru: string;
    text_tk: string;
    text_en: string;
    text_ru: string;
};

const EditVacancy = () => {
    const { id } = useParams();
    const router = useRouter();

    const [data, setData] = useState<VacancyData>({
        title_tk: '',
        title_en: '',
        title_ru: '',
        text_tk: '',
        text_en: '',
        text_ru: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('auth_token');

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/vacancy/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const vacancy = response.data?.[0];

                if (!vacancy) {
                    throw new Error('Vacancy not found');
                }

                setData({
                    title_tk: vacancy.title_tk ?? '',
                    title_en: vacancy.title_en ?? '',
                    title_ru: vacancy.title_ru ?? '',
                    text_tk: vacancy.text_tk ?? '',
                    text_en: vacancy.text_en ?? '',
                    text_ru: vacancy.text_ru ?? '',
                });

            } catch (err) {
                console.error(err);
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleEditorChange = (field: keyof VacancyData, value: string) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('auth_token');

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vacancy/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            router.push(`/admin/vacancy/view-vacancy/${id}`);
        } catch (err) {
            console.error(err);
            setError('Ошибка при сохранении');
        }
    };

    if (loading) return <div className="p-6">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="flex bg-gray-200 min-h-screen">
            <Sidebar />
            <div className="flex-1 p-10 ml-62">
                <TokenTimer />

                <div className="mt-8">
                    <h1 className="text-2xl font-bold mb-4">Edit vacancy</h1>

                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
                        <div className="tabs tabs-lift">

                            <input type="radio" name="tabs" className="tab" aria-label="Turkmen" defaultChecked />
                            <div className="tab-content bg-base-100 p-6">
                                <input
                                    value={data.title_tk}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, title_tk: e.target.value }))
                                    }
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Title"
                                />
                                <TipTapEditor
                                    content={data.text_tk}
                                    onChange={(v) => handleEditorChange('text_tk', v)}
                                />
                            </div>

                            <input type="radio" name="tabs" className="tab" aria-label="English" />
                            <div className="tab-content bg-base-100 p-6">
                                <input
                                    value={data.title_en}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, title_en: e.target.value }))
                                    }
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Title"
                                />
                                <TipTapEditor
                                    content={data.text_en}
                                    onChange={(v) => handleEditorChange('text_en', v)}
                                />
                            </div>

                            <input type="radio" name="tabs" className="tab" aria-label="Russian" />
                            <div className="tab-content bg-base-100 p-6">
                                <input
                                    value={data.title_ru}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, title_ru: e.target.value }))
                                    }
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Title"
                                />
                                <TipTapEditor
                                    content={data.text_ru}
                                    onChange={(v) => handleEditorChange('text_ru', v)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg text-white px-4 py-2 rounded flex items-center"
                        >
                            <DocumentIcon className="w-5 h-5 mr-2" />
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVacancy;
