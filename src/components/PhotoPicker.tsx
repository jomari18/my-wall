"use client";

import { useEffect, useRef, useState } from "react";
import { ALLOWED_PHOTO_TYPES } from "@/lib/constants";

type PhotoPickerProps = {
  photo: File | null;
  disabled: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
};

/** "Add photo" button, and a preview of the chosen photo before sharing. */
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

      {photo && previewUrl ? (
        // Styled like the design's photo card: dark chip top-right, cream tag bottom-left.
        <div className="photo-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview of the photo you chose" />
          <button
            type="button"
            className="chip chip--dark photo-preview__remove"
            onClick={() => {
              onRemove();
              inputRef.current?.focus();
            }}
            disabled={disabled}
          >
            Remove
          </button>
          <span className="chip chip--light photo-preview__name">{photo.name}</span>
        </div>
      ) : (
        <label htmlFor="photo" className={`pill-button${disabled ? " is-disabled" : ""}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="9" cy="10" r="1.6" fill="currentColor" />
            <path
              d="M4 17l5-4.5 3.5 3 3-2.5L20 17"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add photo
        </label>
      )}
    </div>
  );
}
