import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
