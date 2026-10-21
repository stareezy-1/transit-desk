import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <h1>This stop is not on our route.</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Return to the fleet</Link>
    </main>
  );
}
