'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="wrap">
        <p className="mono quiet">Error</p>
        <h1 className="display-52">Something went wrong.</h1>
        <p className="lead" style={{ marginTop: 24 }}>The page did not load. Nothing you submitted has been lost if you saw a case or reference number.</p>
        <button type="button" className="btn" onClick={reset}>Try again</button>
      </div>
    </section>
  );
}
