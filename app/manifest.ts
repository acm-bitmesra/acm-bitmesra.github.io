import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE_NAME, short_name: 'ACM BIT Mesra', description: SITE_DESCRIPTION, start_url: SITE_URL, display: 'standalone', background_color: '#080808', theme_color: '#080808', lang: 'en-IN' };
}
