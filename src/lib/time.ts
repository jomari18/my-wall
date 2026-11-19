/** "just now", "24 min ago", "3 h ago", or "Nov 20 at 3:45 PM". */
export function formatPostTime(iso: string, now: number = Date.now()): string {
  const date = new Date(iso);
  const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day} at ${time}`;
}
