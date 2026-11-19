type AvatarProps = {
  name: string;
  size?: "small" | "large";
};

/** A square profile picture placeholder showing the person's first initial. */
export default function Avatar({ name, size = "small" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className={`avatar avatar--${size}`} aria-hidden="true">
      {initial}
    </div>
  );
}
