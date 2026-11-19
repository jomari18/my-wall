/* eslint-disable @next/next/no-img-element -- small static SVG icons */
import Avatar from "./Avatar";
import type { Post } from "@/lib/posts";

type StoriesProps = {
  posts: Post[];
};

/**
 * The round "stories" row from the design. Here it shows the people who
 * posted most recently, plus a "Your post" bubble that jumps to the composer.
 */
export default function Stories({ posts }: StoriesProps) {
  // Unique names, newest first, at most 10.
  const names = [...new Set(posts.map((post) => post.name))].slice(0, 10);

  return (
    <nav className="stories" aria-label="Recent posters">
      <ul className="stories__list">
        <li>
          <a className="story" href="#message">
            <span className="story__ring">
              <img src="/icons/story-ring-own.svg" alt="" width={64} height={64} />
              <Avatar name="You" size={56} />
              <span className="story__add" aria-hidden="true">
                <img src="/icons/plus.svg" alt="" width={15} height={15} />
              </span>
            </span>
            <span className="story__label story__label--muted">Your post</span>
          </a>
        </li>
        {names.map((name) => (
          <li key={name} className="story">
            <span className="story__ring">
              <img src="/icons/story-ring.svg" alt="" width={64} height={64} />
              <Avatar name={name} size={56} />
            </span>
            <span className="story__label">{name}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
