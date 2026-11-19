"use client";

import { useState } from "react";
import PhotoPicker from "./PhotoPicker";
import { createPost, uploadPhoto, validatePhoto, type Post } from "@/lib/posts";
import { DEFAULT_NAME, MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/lib/constants";

type ComposerProps = {
  onPosted: (post: Post) => void;
};

type Status = "idle" | "uploading" | "saving";

/** The "Write something..." box at the top of the wall. */
export default function Composer({ onPosted }: ComposerProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_MESSAGE_LENGTH - message.length;
  const isBusy = status !== "idle";
  const isEmpty = message.trim().length === 0;
  const isTooLong = remaining < 0;
  const canShare = !isBusy && !isEmpty && !isTooLong;

  function handlePickPhoto(file: File) {
    const problem = validatePhoto(file);
    setError(problem);
    setPhoto(problem ? null : file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canShare) return;
    setError(null);

    try {
      // 1. Upload the photo first (if any) so we can save its URL with the post.
      let imageUrl: string | null = null;
      if (photo) {
        setStatus("uploading");
        imageUrl = await uploadPhoto(photo);
      }

      // 2. Save the post in the database.
      setStatus("saving");
      const post = await createPost({ name, message, imageUrl });

      onPosted(post);
      setMessage(""); // keep the name so it's ready for the next post
      setPhoto(null);
    } catch (err) {
      console.error("Could not share post", err);
      setError("Sorry, your post couldn't be shared. Please check your connection and try again.");
    } finally {
      setStatus("idle");
    }
  }

  const buttonLabel =
    status === "uploading" ? "Uploading photo…" : status === "saving" ? "Sharing…" : "Share";

  return (
    <form id="share" className="composer" onSubmit={handleSubmit} aria-busy={isBusy}>
      <div className="composer__row">
        <label htmlFor="name" className="composer__label">
          Your name
        </label>
        <input
          id="name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={DEFAULT_NAME}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="nickname"
          disabled={isBusy}
        />
      </div>

      <label htmlFor="message" className="visually-hidden">
        Message
      </label>
      <textarea
        id="message"
        className="input composer__message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write something…"
        rows={3}
        aria-describedby="char-count"
        aria-invalid={isTooLong}
        disabled={isBusy}
      />

      <PhotoPicker
        photo={photo}
        disabled={isBusy}
        onPick={handlePickPhoto}
        onRemove={() => setPhoto(null)}
      />

      {error && (
        <p className="notice notice--error" role="alert">
          {error}
        </p>
      )}

      <div className="composer__footer">
        <span
          id="char-count"
          className={`char-count${remaining <= 20 ? " char-count--warn" : ""}${isTooLong ? " char-count--over" : ""}`}
          aria-live="polite"
        >
          {isTooLong
            ? `${-remaining} character${remaining === -1 ? "" : "s"} over the limit`
            : `${remaining} character${remaining === 1 ? "" : "s"} left`}
        </span>
        <button type="submit" className="button" disabled={!canShare}>
          {isBusy && <span className="spinner spinner--light" aria-hidden="true" />}
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
