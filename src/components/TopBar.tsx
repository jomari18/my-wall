import Link from "next/link";

/** The blue bar across the top of the page. */
export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link className="topbar__logo" href="/">
          my wall
        </Link>
        <nav aria-label="Main">
          <ul className="topbar__nav">
            <li>
              <a href="#wall" aria-current="page">
                Wall
              </a>
            </li>
            <li>
              <a href="#share">Write something</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
