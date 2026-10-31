import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="mono quiet">404</p>
        <h1 className="display-52">This page does not exist.</h1>
        <p className="lead" style={{ marginTop: 24 }}>It may have moved, or it was never public.</p>
        <p><Link href="/search" className="text-link">See the full index</Link></p>
      </div>
    </section>
  );
}
