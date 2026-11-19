"use client";

import { useEffect, useRef, useState } from "react";
import { ALLOWED_PHOTO_TYPES } from "@/lib/constants";

type PhotoPickerProps = {
  photo: File | null;
  disabled: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
};

/** "Attach photo" button, and a preview of the chosen photo before sharing. */
export default function PhotoPicker({ photo, disabled, onPick, onRemove }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Make a temporary local URL so the browser can show the preview,
  // and release it when the photo changes or is removed.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onPick(file);
    event.target.value = ""; // lets the same file be picked again after removing it
  }

  return (
    <div className="photo-picker">
      <input
        ref={inputRef}
        id="photo"
        type="file"
        accept={ALLOWED_PHOTO_TYPES.join(",")}
        className="visually-hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      {!photo && (
        <label htmlFor="photo" className={`link-button${disabled ? " is-disabled" : ""}`}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 8.5h12L10 7l-3 3.5L5 8.5zM5 7a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 5 7z"
            />
          </svg>
          Attach photo
        </label>
      )}

      {photo && previewUrl && (
        <div className="photo-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview of the photo you chose" />
          <div className="photo-preview__info">
            <span className="photo-preview__name">{photo.name}</span>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                onRemove();
                inputRef.current?.focus();
              }}
              disabled={disabled}
            >
              Remove photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
