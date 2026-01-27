'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/Components/Sidebar";
import TokenTimer from "@/Components/TokenTimer";
import Link from "next/link";
import {
    PlusCircleIcon,
    TrashIcon,
    PencilIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";

type TeamItem = {
    id: number;
    image: string;
    name_tk?: string;
    name_en?: string;
    name_ru?: string;
    position_tk?: string;
    position_en?: string;
    position_ru?: string;
};

const Team = () => {
    const [team, setTeam] = useState<TeamItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return router.push("/");

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/team`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setTeam(response.data);
        } catch (err) {
            setError("Ошибка при получении данных");
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                router.push("/");
            }
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (deleteLoading) return;
        setIsModalOpen(false);
        setSelectedId(null);
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            setDeleteLoading(true);
            const token = localStorage.getItem("auth_token");

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/team/${selectedId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setTeam((prev) => prev.filter((item) => item.id !== selectedId));
        } catch {
            setError("Ошибка при удалении");
        } finally {
            setDeleteLoading(false);
            closeModal();
        }
    };

    const fixImageUrl = (url: string) => url.replace(/\\/g, "/");

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />

            <div className="flex-1 p-6 ml-64">
                <TokenTimer />

                <div className="mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                    </div>

                    <div className="mb-6 flex justify-end">
                        <Link
                            href="/admin/team/add-team"
                            className="inline-flex items-center bg text-white font-medium py-2 px-4 rounded-lg"
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Add
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
                                <p className="mt-4 text-gray-600">Loading...</p>
                            </div>
                        ) : team.length === 0 ? (
                            <div className="p-12 text-center">
                                <h3 className="text-xl font-semibold text-gray-700">
                                    Data not found
                                </h3>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left">ID</th>
                                        <th className="py-3 px-4 text-left">Image</th>
                                        <th className="py-3 px-4 text-left">
                                            Name & Position
                                        </th>
                                        <th className="py-3 px-4 text-left">Edit</th>
                                        <th className="py-3 px-4 text-left">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                    {team.map((item) => {
                                        const imageUrl = fixImageUrl(
                                            `${process.env.NEXT_PUBLIC_API_URL}/${item.image}`
                                        );

                                        return (
                                            <tr key={item.id}>
                                                <td className="py-4 px-4">#{item.id}</td>

                                                <td className="py-4 px-4">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={item.name_en || "team"}
                                                        width={64}
                                                        height={64}
                                                        className="rounded object-cover"
                                                    />
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col">
                              <span className="font-medium">
                                {item.name_en}
                              </span>
                                                        <span className="text-sm text-gray-500">
                                {item.position_en}
                              </span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <Link
                                                        href={`/admin/team/edit-team/${item.id}`}
                                                        className="inline-flex items-center bg-gray-800 text-white px-3 py-2 rounded"
                                                    >
                                                        <PencilIcon className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={() => openDeleteModal(item.id)}
                                                        className="inline-flex items-center bg-red-600 text-white px-3 py-2 rounded"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeModal}
                    />

                    <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-3">
                            Delete team member
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this item?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border rounded"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
