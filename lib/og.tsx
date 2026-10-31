import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const ogSize = { width: 1200, height: 630 };

/** Generated OpenGraph card: bone ground, ink type, one bronze rule. */
export function ogImage(title: string, kicker: string) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#F6F3EE', color: '#0A0A0B', padding: 72, fontFamily: 'serif' }}>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: '#3A3A42' }}>{kicker}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>{title}</div>
          <div style={{ width: 160, height: 2, background: '#8C6B3F', marginTop: 40 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#3A3A42' }}>
          <span>{site.name}</span>
          <span>{site.city}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
