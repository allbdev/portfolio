import type { MetadataRoute } from 'next';
import { site } from './site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /md/ is the internal target of the /:lang/projeto/:slug.md rewrite.
      disallow: ['/api/', '/md/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
