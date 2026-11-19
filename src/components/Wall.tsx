"use client";

import { useCallback, useEffect, useState } from "react";
import Composer from "./Composer";
import PostList from "./PostList";
import ProfileSidebar from "./ProfileSidebar";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { fetchPosts, type Post } from "@/lib/posts";

/** The whole wall: owns the list of posts and keeps it live. */
export default function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a post to the top of the feed, unless we already have it.
  // (Our own posts arrive twice: once from the insert, once from Realtime.)
  const addPost = useCallback((post: Post) => {
    setPosts((current) =>
      current.some((p) => p.id === post.id) ? current : [post, ...current],
    );
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPosts(await fetchPosts());
    } catch (err) {
      console.error("Could not load posts", err);
      setError("Sorry, we couldn't load the wall right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();

    // Realtime: listen for new rows in the posts table and show them right away.
    if (!isSupabaseConfigured()) return; // loadPosts already shows the error
    const supabase = getSupabase();
    const channel = supabase
      .channel("wall-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => addPost(payload.new as Post),
      )
      .subscribe();

    // Stop listening when the page is closed.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadPosts, addPost]);

  return (
    <div className="layout">
      <ProfileSidebar postCount={loading || error ? null : posts.length} />

      <main id="wall" className="wall">
        <h1 className="wall__title">My Wall</h1>
        <Composer onPosted={addPost} />
        <section aria-labelledby="feed-heading">
          <h2 id="feed-heading" className="wall__section-title">
            Wall posts
          </h2>
          <PostList posts={posts} loading={loading} error={error} onRetry={loadPosts} />
        </section>
      </main>
    </div>
  );
}
