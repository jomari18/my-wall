// Soft tints that sit well on the cream background. Text on all of them is dark.
const TINTS = ["#f6dcd3", "#e3e8d5", "#dfe4ee", "#f3e6c9", "#ead9ec", "#d9ebe6"];

/** Pick the same tint for the same name every time. */
function tintFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TINTS[hash % TINTS.length];
}

type AvatarProps = {
  name: string;
  size: number;
};

/** A round profile picture showing the person's first initial. */
export default function Avatar({ name, size }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className="avatar"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.42, background: tintFor(name) }}
    >
      {initial}
    </span>
  );
}
