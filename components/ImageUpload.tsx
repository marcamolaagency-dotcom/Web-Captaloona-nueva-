import React, { useState, useRef } from 'react';
import { uploadImage, validateImageFile, fileToBase64 } from '../lib/storage';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  folder?: 'artworks' | 'artists' | 'events' | 'general';
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  folder = 'general',
  label = 'Imagen',
  className = '',
}) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Show preview immediately
    const base64Preview = await fileToBase64(file);
    setPreview(base64Preview);

    // Upload file
    setIsUploading(true);
    const result = await uploadImage(file, folder);
    setIsUploading(false);

    if (result.success && result.url) {
      onImageUploaded(result.url);
    } else {
      setError(result.error || 'Error al subir la imagen');
      setPreview(currentImageUrl || null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      setError('Por favor, suelta un archivo de imagen válido');
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
        {label}
      </label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-sm cursor-pointer transition-all
          ${dragActive
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-zinc-200 hover:border-emerald-400 hover:bg-zinc-50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {preview ? (
          // Image preview
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-sm"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="bg-white text-zinc-900 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-emerald-500 hover:text-white transition-colors"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="bg-white text-red-500 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-red-500 hover:text-white transition-colors"
              >
                Eliminar
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs text-zinc-600">Subiendo...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-zinc-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-zinc-500 mb-1">
              {dragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
            </p>
            <p className="text-[10px] text-zinc-400">
              JPG, PNG, WebP o GIF (máx. 5MB)
            </p>
            {isUploading && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg className="animate-spin h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs text-zinc-600">Subiendo...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* URL fallback input */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-zinc-400">o pega una URL:</span>
        <input
          type="url"
          placeholder="https://..."
          onChange={(e) => {
            if (e.target.value) {
              setPreview(e.target.value);
              onImageUploaded(e.target.value);
            }
          }}
          className="flex-1 px-2 py-1 text-xs border-b border-zinc-200 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
