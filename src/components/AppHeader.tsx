/* eslint-disable @next/next/no-img-element -- small static SVG icons */

/** Top of the page: the wordmark with the orange spark from the design. */
export default function AppHeader() {
  return (
    <header className="app-header">
      <h1 className="wordmark">my wall</h1>
      <img src="/icons/spark.svg" alt="" width={27} height={27} className="wordmark__spark" />
    </header>
  );
}
