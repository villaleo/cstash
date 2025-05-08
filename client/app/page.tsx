import Link from "next/link";

export default function App() {
  return (
    <>
      <p>Hi</p>
      <Link href="/snippets">
        <button>Go to Snippets</button>
      </Link>
    </>
  );
}
