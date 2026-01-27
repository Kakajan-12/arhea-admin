'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

type Props = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    label: string;
};

export default function ImageUploader({ files, setFiles, label }: Props) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true
    });

    return (
        <div>
            <label className="block font-semibold mb-2">{label}</label>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded p-6 text-center cursor-pointer 
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
                <input {...getInputProps()} />
                {isDragActive
                    ? 'Drop images here...'
                    : 'Drag images here or click to select'}
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative border rounded overflow-hidden">
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                width={300}
                                height={300}
                                className="object-cover h-32 w-full"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setFiles(prev => prev.filter((_, i) => i !== index))
                                }
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6"
                            >
                                ✕
                            </button>
                            <p className="text-xs truncate p-1">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
