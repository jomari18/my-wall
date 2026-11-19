/* eslint-disable @next/next/no-img-element -- small static SVG icons */

/** Bottom bar from the design: Home (back to top) and Create post (jump to composer). */
export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <a className="bottom-nav__home" href="#top" aria-label="Home, back to top" aria-current="page">
        <img src="/icons/home.svg" alt="" width={23} height={23} />
      </a>
      <a className="bottom-nav__create" href="#message" aria-label="Create a post">
        <img src="/icons/add-post.svg" alt="" width={24} height={24} />
      </a>
    </nav>
  );
}
