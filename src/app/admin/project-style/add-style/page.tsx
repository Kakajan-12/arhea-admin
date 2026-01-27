'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/Components/Sidebar';
import TokenTimer from '@/Components/TokenTimer';

const AddStyle = () => {
    const [style_tk, setStyleTk] = useState('');
    const [style_en, setStyleEn] = useState('');
    const [style_ru, setStyleRu] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('Нет токена. Пользователь не авторизован.');
            return;
        }

        const payload = {
            style_tk,
            style_en,
            style_ru,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project-style`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Категория добавлена!', data);
                setStyleTk('');
                setStyleEn('');
                setStyleRu('');
                router.push('/admin/project-style');
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
            <Sidebar />
            <div className="flex-1 p-10 ml-62">
                <TokenTimer />
                <div className="mt-8">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white"
                    >
                        <h2 className="text-2xl font-bold mb-4">Add style</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Turkmen:</label>
                            <input
                                value={style_tk}
                                onChange={(e) => setStyleTk(e.target.value)}
                                type="text"
                                required
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">English:</label>
                            <input
                                value={style_en}
                                onChange={(e) => setStyleEn(e.target.value)}
                                type="text"
                                required
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Russian:</label>
                            <input
                                value={style_ru}
                                onChange={(e) => setStyleRu(e.target.value)}
                                type="text"
                                required
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add style
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStyle;
