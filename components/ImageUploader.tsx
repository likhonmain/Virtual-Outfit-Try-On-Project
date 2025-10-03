
import React, { useCallback, useState } from 'react';
import type { ImageFile } from '../types';
import { IconUpload, IconX } from './Icons';

interface ImageUploaderProps {
  title: string;
  onFileChange: (file: ImageFile | null) => void;
  file: ImageFile | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onFileChange, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileChange({ file: selectedFile, previewUrl: reader.result as string });
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onFileChange(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col shadow-lg">
      <h2 className="text-lg font-semibold text-center text-gray-300 mb-4">{title}</h2>
      <label
        className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer transition-colors duration-200 relative aspect-w-1 aspect-h-1 ${
          isDragging ? 'border-indigo-400 bg-gray-700' : 'border-gray-600 hover:border-indigo-500'
        }`}
      >
        <div
          className="w-full h-full"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {file ? (
            <>
              <img src={file.previewUrl} alt="Preview" className="object-contain w-full h-full rounded-md" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                aria-label="Remove image"
              >
                <IconX className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center p-4">
              <IconUpload className="w-10 h-10 mb-2" />
              <p className="font-semibold">Drag & drop or click to upload</p>
              <p className="text-xs">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      </label>
    </div>
  );
};
