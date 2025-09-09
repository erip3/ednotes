import React, { useRef } from "react";

interface ImageResourceProps {
  id: string;
  src: string;
  alt?: string;
  onUpdate: (id: string, newSrc: string) => void;
}

export default function ImageResource({
  id,
  onUpdate,
}: ImageResourceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    onUpdate(id, objectUrl);
  }

  return (
    <div className="mb-4 flex flex-col items-center">
      <label className="mb-2 font-medium">This article uses an image. Use the default or upload your own here:</label>
      <button
        type="button"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload New Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
