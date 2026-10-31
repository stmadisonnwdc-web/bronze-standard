import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const isPublic = process.env.SITE_PUBLIC === 'true';
const isDev = process.env.NODE_ENV === 'development';
const analyze = process.env.ANALYZE === 'true';

// Pages that must never be indexed, even when the site is public.
const privatePaths = ['/ledger', '/ledger/:path*', '/apply/confirm', '/takedown/confirm', '/search', '/api/:path*'];

const csp = [
  "default-src 'self'",
  // Next.js inline bootstrap; no third-party scripts. The dev server also needs eval for fast refresh.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Until Gate 6 clears, the whole site is a private preview.
      ...(isPublic ? [] : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]),
      ...privatePaths.map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] })),
      { source: '/env/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
  // Webpack hook only for `npm run analyze` (next build --webpack). Turbopack, the default
  // bundler, already puts the dynamically imported 3D code in its own cacheable async chunk,
  // and a webpack hook would conflict with it, so it is attached only when analyzing.
  ...(analyze
    ? {
        webpack(cfg: { optimization?: { splitChunks?: false | { cacheGroups?: Record<string, unknown> } } }, { isServer }: { isServer: boolean }) {
          const sc = cfg.optimization?.splitChunks;
          if (!isServer && sc) {
            sc.cacheGroups = {
              ...(sc.cacheGroups ?? {}),
              vendorThree: {
                test: /[\\/]node_modules[\\/](three|@react-three|postprocessing|three-stdlib|maath)[\\/]/,
                name: 'vendor-three',
                chunks: 'async',
                priority: 40,
                enforce: true,
              },
            };
          }
          return cfg;
        },
      }
    : {}),
};

export default bundleAnalyzer({ enabled: analyze })(config);
