'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/Components/Sidebar';
import TokenTimer from '@/Components/TokenTimer';
import TipTapEditor from '@/Components/TipTapEditor';

const AddVacancy = () => {
    const [isClient, setIsClient] = useState(false);

    const [title_tk, setTitleTk] = useState('');
    const [title_en, setTitleEn] = useState('');
    const [title_ru, setTitleRu] = useState('');

    const [text_tk, setTextTk] = useState('');
    const [text_en, setTextEn] = useState('');
    const [text_ru, setTextRu] = useState('');

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('Нет токена');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vacancy`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title_tk,
                        title_en,
                        title_ru,
                        text_tk,
                        text_en,
                        text_ru,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            router.push('/admin/vacancy');
        } catch (error) {
            console.error('Ошибка при добавлении вакансии:', error);
        }
    };

    return (
        <div className="flex bg-gray-200">
            <Sidebar />
            <div className="flex-1 p-10 ml-62">
                <TokenTimer />

                <div className="mt-8">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white"
                    >
                        <h2 className="text-2xl font-bold mb-4">Add vacancy</h2>

                        {isClient && (
                            <div className="tabs tabs-lift">
                                <input
                                    type="radio"
                                    name="tabs"
                                    className="tab"
                                    aria-label="Turkmen"
                                    defaultChecked
                                />
                                <div className="tab-content p-6 bg-base-100 border-base-300">
                                    <div className="mb-4">
                                        <label className="font-semibold block mb-2">
                                            Title
                                        </label>
                                        <input
                                            value={title_tk}
                                            onChange={(e) => setTitleTk(e.target.value)}
                                            className="border rounded p-2 w-full"
                                        />
                                    </div>

                                    <TipTapEditor
                                        content={text_tk}
                                        onChange={setTextTk}
                                    />
                                </div>

                                <input
                                    type="radio"
                                    name="tabs"
                                    className="tab"
                                    aria-label="English"
                                />
                                <div className="tab-content p-6 bg-base-100 border-base-300">
                                    <div className="mb-4">
                                        <label className="font-semibold block mb-2">
                                            Title
                                        </label>
                                        <input
                                            value={title_en}
                                            onChange={(e) => setTitleEn(e.target.value)}
                                            className="border rounded p-2 w-full"
                                        />
                                    </div>

                                    <TipTapEditor
                                        content={text_en}
                                        onChange={setTextEn}
                                    />
                                </div>

                                <input
                                    type="radio"
                                    name="tabs"
                                    className="tab"
                                    aria-label="Russian"
                                />
                                <div className="tab-content p-6 bg-base-100 border-base-300">
                                    <div className="mb-4">
                                        <label className="font-semibold block mb-2">
                                            Title
                                        </label>
                                        <input
                                            value={title_ru}
                                            onChange={(e) => setTitleRu(e.target.value)}
                                            className="border rounded p-2 w-full"
                                        />
                                    </div>

                                    <TipTapEditor
                                        content={text_ru}
                                        onChange={setTextRu}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full mt-6 bg text-white font-bold py-2 rounded hover:bg-blue-700"
                        >
                            Add vacancy
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVacancy;
