'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="error-page">
      <h1>Something interrupted the journey.</h1>
      <p>Please try loading Transit Desk again.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
