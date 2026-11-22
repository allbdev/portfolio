import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';
// Preview deployments get Vercel's toolbar (comments), which loads from vercel.live.
const isPreview = process.env.VERCEL_ENV === 'preview';

/**
 * The pages are prerendered, so the policy is static rather than nonce-based:
 * a nonce would force every route to render per request. That is why
 * script-src keeps 'unsafe-inline' (Next's inline hydration payload, the
 * colour-mode script, JSON-LD) and style-src keeps it for Emotion/MUI.
 * Everything else the site loads (fonts, images, analytics, chat API) is
 * same-origin.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}${isPreview ? ' https://vercel.live' : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isPreview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''}`,
  "worker-src 'self' blob:",
  `frame-src ${isPreview ? 'https://vercel.live' : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async rewrites() {
    return {
      // Runs before the [lang]/projeto/[projetoSlug] page would claim the URL.
      beforeFiles: [
        { source: '/:lang(en|pt)/projeto/:slug.md', destination: '/md/:lang/:slug' },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
