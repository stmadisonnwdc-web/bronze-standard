import type { BaselineMetric } from '@/content/baseline';
import { CountUp } from '@/components/motion/CountUp';
import { TiltCard } from '@/components/motion/TiltCard';
import { formatDate } from '@/lib/format';

const NOTE = 'Directional, not a projection.';

export function MetricsTable({ metrics }: { metrics: BaselineMetric[] }) {
  return (
    <div className="table-wrap">
      <table className="metrics">
        <caption className="visually-hidden">Baseline figures, with sample size and method reference</caption>
        <thead>
          <tr>
            <th scope="col">Measure</th>
            <th scope="col">Value</th>
            <th scope="col">n</th>
            <th scope="col">Method</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.key}>
              <th scope="row" style={{ font: 'inherit', textTransform: 'none', letterSpacing: 0, color: 'var(--text)' }}>{m.label}</th>
              <td><CountUp value={m.value} unit={m.unit} /></td>
              <td className="mono">{m.n}</td>
              <td className="mono"><a href={`#${m.methodologyRef.toLowerCase()}`} className="text-link">{m.methodologyRef}</a></td>
              <td className="quiet">
                {m.note} {NOTE}
                <br />
                <span className="mono">Updated {formatDate(m.updatedAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MetricTiles({ metrics }: { metrics: BaselineMetric[] }) {
  return (
    <div className="metric-tiles">
      {metrics.map((m) => (
        <TiltCard key={m.key} className="card metric-tile">
          <CountUp value={m.value} unit={m.unit} />
          <p className="label">{m.label}</p>
          <p className="note mono nocase">n = {m.n} · {m.methodologyRef} · {NOTE}</p>
        </TiltCard>
      ))}
    </div>
  );
}
