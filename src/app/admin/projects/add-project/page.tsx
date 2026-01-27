'use client';

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Sidebar from '@/Components/Sidebar';
import TokenTimer from '@/Components/TokenTimer';
import TipTapEditor from '@/Components/TipTapEditor';
import ImageUploader from "@/app/admin/projects/add-project/ImageUploader";

const AddProject = () => {
    const [isClient, setIsClient] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [title_tk, setTitleTk] = useState('');
    const [title_en, setTitleEn] = useState('');
    const [title_ru, setTitleRu] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [area, setArea] = useState('');
    const [client_tk, setClientTk] = useState('');
    const [client_en, setClientEn] = useState('');
    const [client_ru, setClientRu] = useState('');
    const [first_section_tk, setFirstSectionTk] = useState('');
    const [first_section_en, setFirstSectionEn] = useState('');
    const [first_section_ru, setFirstSectionRu] = useState('');
    const [second_section_tk, setSecondSectionTk] = useState('');
    const [second_section_en, setSecondSectionEn] = useState('');
    const [second_section_ru, setSecondSectionRu] = useState('');
    const [third_section_tk, setThirdSectionTk] = useState('');
    const [third_section_en, setThirdSectionEn] = useState('');
    const [third_section_ru, setThirdSectionRu] = useState('');
    const [architect_tk, setArchitectTk] = useState('');
    const [architect_en, setArchitectEn] = useState('');
    const [architect_ru, setArchitectRu] = useState('');
    const [lead_designer_tk, setLeadDesignerTk] = useState('');
    const [lead_designer_en, setLeadDesignerEn] = useState('');
    const [lead_designer_ru, setLeadDesignerRu] = useState('');
    const [interior_designer_tk, setInteriorDesignerTk] = useState('');
    const [interior_designer_en, setInteriorDesignerEn] = useState('');
    const [interior_designer_ru, setInteriorDesignerRu] = useState('');
    const [p_manager_tk, setPManagerTk] = useState('');
    const [p_manager_en, setPManagerEn] = useState('');
    const [p_manager_ru, setPManagerRu] = useState('');
    const [location_id, setLocationId] = useState('');
    const [type_id, setTypeId] = useState('');
    const [style_id, setStyleId] = useState('');
    const [types, setTypes] = useState<
        { id: number; type_tk: string; type_en: string; type_ru: string }[]
    >([]);
    const [style, setStyle] = useState<
        { id: number; style_tk: string; style_en: string; style_ru: string }[]
    >([]);
    const [location, setLocation] = useState<
        { id: number; location_tk: string; location_en: string; location_ru: string }[]
    >([]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [drawingFiles, setDrawingFiles] = useState<File[]>([]);


    const router = useRouter();

    useEffect(() => {
        setIsClient(true)
        const fetchData = async () => {
            try {
                const [typesRes, styleRes, locationRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project-type`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project-style`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project-location`)
                ]);
                const [typesData, styleData, locationData] = await Promise.all([
                    typesRes.json(),
                    styleRes.json(),
                    locationRes.json()
                ]);

                setTypes(typesData);
                setStyle(styleData);
                setLocation(locationData)
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('Нет токена. Пользователь не авторизован.');
            return;
        }

        const formData = new FormData();
        if (image) formData.append('image', image);
        formData.append('title_tk', title_tk ?? '');
        formData.append('title_en', title_en ?? '');
        formData.append('title_ru', title_ru ?? '');
        formData.append('end_date', endDate ?? '');
        formData.append('area', area ?? '');
        formData.append('client_tk', client_tk ?? '');
        formData.append('client_en', client_en ?? '');
        formData.append('client_ru', client_ru ?? '');
        formData.append('start_date', startDate ?? '');
        formData.append('first_section_tk', first_section_tk ?? '');
        formData.append('first_section_en', first_section_en ?? '');
        formData.append('first_section_ru', first_section_ru ?? '');
        formData.append('second_section_tk', second_section_tk ?? '');
        formData.append('second_section_en', second_section_en ?? '');
        formData.append('second_section_ru', second_section_ru ?? '');
        formData.append('third_section_tk', third_section_tk ?? '');
        formData.append('third_section_en', third_section_en ?? '');
        formData.append('third_section_ru', third_section_ru ?? '');
        formData.append('architect_tk', architect_tk ?? '');
        formData.append('architect_en', architect_en ?? '');
        formData.append('architect_ru', architect_ru ?? '');
        formData.append('lead_designer_tk', lead_designer_tk ?? '');
        formData.append('lead_designer_en', lead_designer_en ?? '');
        formData.append('lead_designer_ru', lead_designer_ru ?? '');
        formData.append('interior_designer_tk', interior_designer_tk ?? '');
        formData.append('interior_designer_en', interior_designer_en ?? '');
        formData.append('interior_designer_ru', interior_designer_ru ?? '');
        formData.append('p_manager_tk', p_manager_tk ?? '');
        formData.append('p_manager_en', p_manager_en ?? '');
        formData.append('p_manager_ru', p_manager_ru ?? '');
        formData.append('location_id', location_id ?? '');
        formData.append('type_id', type_id ?? '');
        formData.append('style_id', style_id ?? '');

        for (const file of galleryFiles) {
            formData.append('gallery', file);
        }

        for (const file of drawingFiles) {
            formData.append('drawings', file);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
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
                setTitleTk('');
                setTitleEn('');
                setTitleRu('');
                setEndDate('');
                setStartDate('');
                setArea('');
                setClientTk('');
                setClientEn('');
                setClientRu('');
                setFirstSectionTk('');
                setFirstSectionEn('');
                setFirstSectionRu('');
                setSecondSectionTk('');
                setSecondSectionEn('');
                setSecondSectionRu('');
                setThirdSectionTk('');
                setThirdSectionEn('');
                setThirdSectionRu('');
                setArchitectTk('');
                setArchitectEn('');
                setArchitectRu('');
                setLeadDesignerTk('');
                setLeadDesignerEn('');
                setLeadDesignerRu('');
                setInteriorDesignerTk('')
                setInteriorDesignerEn('')
                setInteriorDesignerRu('')
                setPManagerTk('');
                setPManagerEn('');
                setPManagerRu('');
                setTypeId('');
                setStyleId('');
                setLocationId('');
                router.push('/admin/projects');
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
                        <h2 className="text-2xl font-bold mb-4 text-left">Add project</h2>

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
                            <div className="w-full">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Select Type:
                                </label>
                                <select
                                    id="project_type"
                                    name="type_id"
                                    value={type_id}
                                    onChange={(e) => setTypeId(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Select type</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type_en}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Select style:
                                </label>
                                <select
                                    id="project_style"
                                    name="style_id"
                                    value={style_id}
                                    onChange={(e) => setStyleId(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Select category</option>
                                    {style.map((style) => (
                                        <option key={style.id} value={style.id}>
                                            {style.style_en}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Select Location:
                                </label>
                                <select
                                    id="location_id"
                                    name="location_id"
                                    value={location_id}
                                    onChange={(e) => setLocationId(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Select location</option>
                                    {location.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.location_en}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-4 flex space-x-4">
                            <div className="w-full">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Start year:
                                </label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 10}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="2020"
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    End year:
                                </label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 10}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                    placeholder="2024"
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Area:
                                </label>
                                <input
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    type="text"
                                    required
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                            </div>
                        </div>

                        {isClient && (
                            <>
                                <div className="tabs tabs-lift">
                                    <input type="radio" name="my_tabs_3" className="tab" aria-label="Turkmen"
                                           defaultChecked/>
                                    <div className="tab-content bg-base-100 border-base-300 p-6">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">Title:</label>
                                            <TipTapEditor
                                                content={title_tk}
                                                onChange={(content) => setTitleTk(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Client:</label>
                                            <input
                                                value={client_tk}
                                                onChange={(e) => setClientTk(e.target.value)}
                                                type="text"
                                                required
                                                className="border border-gray-300 rounded p-2 w-full"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">First
                                                section:</label>
                                            <TipTapEditor
                                                content={first_section_tk}
                                                onChange={(content) => setFirstSectionTk(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Second
                                                section:</label>
                                            <TipTapEditor
                                                content={second_section_tk}
                                                onChange={(content) => setSecondSectionTk(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Third
                                                section:</label>
                                            <TipTapEditor
                                                content={third_section_tk}
                                                onChange={(content) => setThirdSectionTk(content)}
                                            />
                                        </div>
                                        <div className="flex w-full space-x-4">
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Architect:</label>
                                                <input
                                                    content={architect_tk}
                                                    onChange={(e) => setArchitectTk(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Lead
                                                    designer:</label>
                                                <input
                                                    value={lead_designer_tk}
                                                    onChange={(e) => setLeadDesignerTk(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Interior
                                                    designer:</label>
                                                <input
                                                    value={interior_designer_tk}
                                                    onChange={(e) => setInteriorDesignerTk(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Project
                                                    manager:</label>
                                                <input
                                                    value={p_manager_tk}
                                                    onChange={(e) => setPManagerTk(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <input type="radio" name="my_tabs_3" className="tab" aria-label="English"/>
                                    <div className="tab-content bg-base-100 border-base-300 p-6">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">Title:</label>
                                            <TipTapEditor
                                                content={title_en}
                                                onChange={(content) => setTitleEn(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Client:</label>
                                            <input
                                                value={client_en}
                                                onChange={(e) => setClientEn(e.target.value)}
                                                type="text"
                                                required
                                                className="border border-gray-300 rounded p-2 w-full"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">First
                                                section:</label>
                                            <TipTapEditor
                                                content={first_section_en}
                                                onChange={(content) => setFirstSectionEn(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Second
                                                section:</label>
                                            <TipTapEditor
                                                content={second_section_en}
                                                onChange={(content) => setSecondSectionEn(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Third
                                                section:</label>
                                            <TipTapEditor
                                                content={third_section_en}
                                                onChange={(content) => setThirdSectionEn(content)}
                                            />
                                        </div>
                                        <div className="flex w-full space-x-4">
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Architect:</label>
                                                <input
                                                    content={architect_en}
                                                    onChange={(e) => setArchitectEn(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Lead
                                                    designer:</label>
                                                <input
                                                    value={lead_designer_en}
                                                    onChange={(e) => setLeadDesignerEn(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Interior
                                                    designer:</label>
                                                <input
                                                    value={interior_designer_en}
                                                    onChange={(e) => setInteriorDesignerEn(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Project
                                                    manager:</label>
                                                <input
                                                    value={p_manager_en}
                                                    onChange={(e) => setPManagerEn(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <input type="radio" name="my_tabs_3" className="tab" aria-label="Russian"/>
                                    <div className="tab-content bg-base-100 border-base-300 p-6">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">Title:</label>
                                            <TipTapEditor
                                                content={title_ru}
                                                onChange={(content) => setTitleRu(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Client:</label>
                                            <input
                                                value={client_ru}
                                                onChange={(e) => setClientRu(e.target.value)}
                                                type="text"
                                                required
                                                className="border border-gray-300 rounded p-2 w-full"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">First
                                                section:</label>
                                            <TipTapEditor
                                                content={first_section_ru}
                                                onChange={(content) => setFirstSectionRu(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Second
                                                section:</label>
                                            <TipTapEditor
                                                content={second_section_ru}
                                                onChange={(content) => setSecondSectionRu(content)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 font-semibold mb-2">Third
                                                section:</label>
                                            <TipTapEditor
                                                content={third_section_ru}
                                                onChange={(content) => setThirdSectionRu(content)}
                                            />
                                        </div>
                                        <div className="flex w-full space-x-4">
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Architect:</label>
                                                <input
                                                    content={architect_ru}
                                                    onChange={(e) => setArchitectRu(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Lead
                                                    designer:</label>
                                                <input
                                                    value={lead_designer_ru}
                                                    onChange={(e) => setLeadDesignerRu(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Interior
                                                    designer:</label>
                                                <input
                                                    value={interior_designer_ru}
                                                    onChange={(e) => setInteriorDesignerRu(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label
                                                    className="block text-gray-700 font-semibold mb-2">Project
                                                    manager:</label>
                                                <input
                                                    value={p_manager_ru}
                                                    onChange={(e) => setPManagerRu(e.target.value)}
                                                    type="text"
                                                    required
                                                    className="border border-gray-300 rounded p-2 w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <input type="radio" name="my_tabs_3" className="tab" aria-label="Gallery"/>
                                    <div className="tab-content bg-base-100 border-base-300 p-6">
                                        <div className="mb-4 w-full">
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Gallery:
                                            </label>
                                            <ImageUploader
                                                label="Gallery"
                                                files={galleryFiles}
                                                setFiles={setGalleryFiles}
                                            />

                                        </div>
                                        <div className="mb-4 w-full">
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Drawing:
                                            </label>

                                            <ImageUploader
                                                label="Drawings"
                                                files={drawingFiles}
                                                setFiles={setDrawingFiles}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                        >
                            Add project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProject;
