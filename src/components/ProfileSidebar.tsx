type ProfileSidebarProps = {
  postCount: number | null;
};

/** Left column: the wall's "profile" picture and an Information box. */
export default function ProfileSidebar({ postCount }: ProfileSidebarProps) {
  return (
    <aside className="sidebar" aria-label="About this wall">
      <div className="sidebar__photo" aria-hidden="true">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect width="100" height="100" fill="#e9ebf2" />
          <circle cx="50" cy="38" r="18" fill="#bdc7d8" />
          <path d="M18 92c4-20 18-30 32-30s28 10 32 30z" fill="#bdc7d8" />
        </svg>
      </div>

      <section className="box">
        <h2 className="box__title">Information</h2>
        <dl className="info">
          <dt>About</dt>
          <dd>A public wall. Anyone can write on it, no login needed.</dd>
          <dt>Posts</dt>
          <dd>{postCount === null ? "…" : postCount}</dd>
        </dl>
      </section>
    </aside>
  );
}
