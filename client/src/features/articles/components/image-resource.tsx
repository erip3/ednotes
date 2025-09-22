import React, { useRef } from 'react';

interface ImageResourceProps {
  id: string;
  src: string;
  alt?: string;
  onUpdate: (id: string, newSrc: string) => void;
  upload?: boolean;
}

/**
 * ImageResource component to display and manage an image resource.
 * @param props - Props for the ImageResource component
 * @returns JSX.Element
 */
export const ImageResource = ({
  id,
  src,
  alt,
  onUpdate,
  upload = true,
}: ImageResourceProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    onUpdate(id, objectUrl);
  }

  return upload ? (
    <div className="mb-4 flex flex-col items-center">
      <>
        <img src={src} alt={alt} className="mb-2 max-w-full rounded shadow" />
        <label className="mb-2 font-medium">
          This article uses an image. Use the default or upload your own here:
        </label>
        <button
          type="button"
          className="mt-2 rounded bg-accent px-4 py-2 text-accent-foreground transition hover:bg-accent/60"
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
      </>
    </div>
  ) : null;
};
