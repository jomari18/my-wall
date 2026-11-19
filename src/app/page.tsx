import AppHeader from "@/components/AppHeader";
import Wall from "@/components/Wall";

export default function Home() {
  return (
    <div id="top" className="app">
      <a className="skip-link" href="#message">
        Skip to write a post
      </a>
      <AppHeader />
      <Wall />
    </div>
  );
}
