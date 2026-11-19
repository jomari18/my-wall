"use client";

import { useEffect, useState } from "react";
import PostItem from "./PostItem";
import type { Post } from "@/lib/posts";

type PostListProps = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

/** The feed, plus its loading, error and empty states. */
export default function PostList({ posts, loading, error, onRetry }: PostListProps) {
  // Re-render every 30 seconds so "5 min ago" stays accurate.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="feed-state" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>Loading posts…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notice notice--error" role="alert">
        <p>{error}</p>
        <button type="button" className="button button--ghost" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed-state">
        <p className="feed-state__title">Nothing here yet</p>
        <p>Be the first to write something on this wall.</p>
      </div>
    );
  }

  return (
    <ul className="feed" aria-label="Wall posts">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} now={now} />
      ))}
    </ul>
  );
}
