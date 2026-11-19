import { getSupabase } from "./supabase";
import {
  ALLOWED_PHOTO_TYPES,
  DEFAULT_NAME,
  MAX_PHOTO_BYTES,
  PHOTO_BUCKET,
} from "./constants";

export type Post = {
  id: string;
  name: string;
  message: string;
  image_url: string | null;
  created_at: string;
};

/** Loads every post, newest first. */
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("id, name, message, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Saves one post and returns the row the database created. */
export async function createPost(input: {
  name: string;
  message: string;
  imageUrl: string | null;
}): Promise<Post> {
  const { data, error } = await getSupabase()
    .from("posts")
    .insert({
      name: input.name.trim() || DEFAULT_NAME,
      message: input.message.trim(),
      image_url: input.imageUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Returns an error message if the file is not an allowed photo, otherwise null. */
export function validatePhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG, GIF or WebP image.";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "That photo is over 5 MB. Please choose a smaller one.";
  }
  return null;
}

/** Uploads a photo to Supabase Storage and returns its public URL. */
export async function uploadPhoto(file: File): Promise<string> {
  const supabase = getSupabase();
  const extension = file.type.split("/")[1]; // "image/png" -> "png"
  // A random file name means two visitors can never overwrite each other's photo.
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}
