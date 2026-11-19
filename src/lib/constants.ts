// These limits match the CHECK constraints and bucket settings in
// supabase/migrations. The UI checks them first; the database is the final guard.
export const MAX_MESSAGE_LENGTH = 280;
export const MAX_NAME_LENGTH = 50;
export const DEFAULT_NAME = "Anonymous";

export const PHOTO_BUCKET = "wall-photos";
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
