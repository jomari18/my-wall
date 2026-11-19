import Avatar from "./Avatar";
import { formatPostTime } from "@/lib/time";
import type { Post } from "@/lib/posts";

type PostItemProps = {
  post: Post;
  now: number;
};

/** Show #hashtags in the accent color, like the design's caption. */
function withHashtags(message: string) {
  return message.split(/(#[\p{L}\p{N}_]+)/u).map((part, i) =>
    part.startsWith("#") ? (
      <span key={i} className="hashtag">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** One post: author row, optional photo, then the message. */
export default function PostItem({ post, now }: PostItemProps) {
  return (
    <li className="post">
      <header className="post__header">
        <Avatar name={post.name} size={34} />
        <div className="post__meta">
          <span className="post__name">{post.name}</span>
          <time className="post__time" dateTime={post.created_at}>
            {formatPostTime(post.created_at, now)}
          </time>
        </div>
      </header>

      {post.image_url && (
        // A plain <img> keeps this simple: the photo is already a public URL.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="post__photo"
          src={post.image_url}
          alt={`Photo shared by ${post.name}`}
          loading="lazy"
        />
      )}

      <p className="post__text">
        <span className="post__caption-name">{post.name}</span>
        {withHashtags(post.message)}
      </p>
    </li>
  );
}
