'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Sidebar from "@/Components/Sidebar";
import TokenTimer from "@/Components/TokenTimer";
import Link from "next/link";
import {PencilIcon, PlusCircleIcon, TrashIcon} from "@heroicons/react/16/solid";

type LocationItem = {
    id: string;
    location_tk: string;
    location_en: string;
    location_ru: string;
};

const ProjectLocation = () => {
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    router.push('/');
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/project-location`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLocations(response.data);
            } catch (err) {
                const axiosError = err as AxiosError;
                console.error(axiosError);
                setError("Ошибка при получении данных");

                if (axios.isAxiosError(axiosError) && axiosError.response?.status === 401) {
                    router.push("/");
                }
            }
        };

        fetchLocations();
    }, [router]);

    const openDeleteModal = (id: string) => {
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
            const token = localStorage.getItem('auth_token');

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/project-location/${selectedId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setLocations(prev => prev.filter(item => item.id !== selectedId));
        } catch (err) {
            console.error(err);
            setError("Ошибка при удалении");
        } finally {
            setDeleteLoading(false);
            closeModal();
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex bg-gray-200">
            <Sidebar />
            <div className="flex-1 p-10 ml-62">
                <TokenTimer />
                <div className="mt-8">
                    <div className="w-full flex justify-between">
                        <h2 className="text-2xl font-bold mb-4">Project location</h2>
                        <Link href="/admin/project-location/add-location"
                              className="bg text-white h-fit py-2 px-8 rounded-md cursor-pointer flex items-center">
                            <PlusCircleIcon className="size-6" color="#ffffff" />
                            <div className="ml-2">Add</div>
                        </Link>
                    </div>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-gray-600">Turkmen</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-gray-600">English</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-gray-600">Russian</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-gray-600">Edit</th>
                            <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-gray-600">Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {locations.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4">No data available</td>
                            </tr>
                        ) : (
                            locations.map((location) => (
                                <tr key={location.id}>
                                    <td className="py-4 px-4 border-b border-gray-200">
                                        <div dangerouslySetInnerHTML={{__html: location.location_tk}}/>
                                    </td>
                                    <td className="py-4 px-4 border-b border-gray-200">
                                        <div dangerouslySetInnerHTML={{__html: location.location_en}}/>
                                    </td>
                                    <td className="py-4 px-4 border-b border-gray-200">
                                        <div dangerouslySetInnerHTML={{__html: location.location_ru}}/>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Link
                                            href={`/admin/project-location/edit-location/${location.id}`}
                                            className="inline-flex items-center bg-gray-800 text-white px-3 py-2 rounded"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2"/>
                                            Edit
                                        </Link>
                                    </td>

                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => openDeleteModal(location.id)}
                                            className="inline-flex items-center bg-red-600 text-white px-3 py-2 rounded"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2"/>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeModal}
                    />

                    <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-3">
                            Delete project style
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this item?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                disabled={deleteLoading}
                                className="px-4 py-2 border rounded"
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

export default ProjectLocation;
