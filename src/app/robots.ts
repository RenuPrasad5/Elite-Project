import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/signup'],
      disallow: [
        '/admin/', 
        '/api/', 
        '/dashboard/', 
        '/checkout/', 
        '/downloads/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
