import TopBar from "@/components/TopBar";
import Wall from "@/components/Wall";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#message">
        Skip to write a post
      </a>
      <TopBar />
      <Wall />
      <footer className="footer">My Wall · Test 2</footer>
    </>
  );
}
