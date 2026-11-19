import Avatar from "./Avatar";
import { formatPostTime } from "@/lib/time";
import type { Post } from "@/lib/posts";

type PostItemProps = {
  post: Post;
  now: number;
};

/** One message on the wall. */
export default function PostItem({ post, now }: PostItemProps) {
  return (
    <li className="post">
      <Avatar name={post.name} />
      <div className="post__body">
        <p className="post__text">
          <span className="post__name">{post.name}</span> {post.message}
        </p>
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
        <time className="post__time" dateTime={post.created_at}>
          {formatPostTime(post.created_at, now)}
        </time>
      </div>
    </li>
  );
}
