import { methodology } from '@/content/baseline';

/** Rendered from a read-only content file. It has no props, so a page cannot alter or omit its text. */
export function Methodology() {
  return (
    <section className="methodology" aria-labelledby="methodology-title" id="methodology">
      <span className="mono">Methodology</span>
      <h2 id="methodology-title" className="display-36" style={{ marginBottom: 24 }}>How every figure is made</h2>
      <ol>
        {methodology.map((m) => (
          <li key={m.id} id={m.id.toLowerCase()}>
            <span className="mono accent">{m.id}</span> {m.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
