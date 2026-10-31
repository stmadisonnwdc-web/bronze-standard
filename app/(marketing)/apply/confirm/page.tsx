import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Application received', robots: { index: false, follow: false } };

type Search = { searchParams: Promise<{ ref?: string }> };

export default async function ApplyConfirm({ searchParams }: Search) {
  const { ref } = await searchParams;
  const safeRef = ref && /^APP-\d{8}-[0-9A-F]{6}$/.test(ref) ? ref : null;
  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow mono"><span className="idx">04</span> Confirmation</p>
        <h1 className="display-52">Application received.</h1>
        <p className="lead" style={{ marginTop: 24 }}>We read every application and reply by email within ten working days. Screening calls are limited to three a week.</p>
        {safeRef ? <p className="mono">Reference {safeRef}</p> : null}
      </div>
    </section>
  );
}
