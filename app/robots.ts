import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/blog/'],
        },
        sitemap: 'https://puzzlynest.com/sitemap.xml',
    };
}
