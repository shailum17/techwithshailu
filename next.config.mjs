const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.logo.dev' },
      { protocol: 'https', hostname: 't3.gstatic.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  async redirects() {
    return [
      // Legacy roadmap URLs (/resources/<slug>) → real pages. Done here rather
      // than only in app/resources/[slug] so crawlers get a true 308 instead of
      // a streamed client-side redirect.
      {
        source: '/resources/:slug(frontend|dsa|backend|system-design|aiml|devops)',
        destination: '/resources/roadmaps/:slug',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply to every route
        source: '/(.*)',
        headers: [
          // Force HTTPS for 1 year, include subdomains, allow preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Prevent this site from being embedded in iframes (clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Stop browsers from sniffing MIME types
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Don't send the referrer to external sites
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Disable FLoC / restrict browser feature APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy
          // script-src 'unsafe-inline' is still needed for Next.js inline bootstrap
          // scripts (removing it requires per-request nonces via middleware).
          // 'unsafe-eval' is only needed by the dev server (React Refresh), so
          // it is not sent in production.
          // img-src allows Cloudinary, Supabase storage, and logo providers
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://vercel.live`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://img.logo.dev https://t3.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://api.cloudinary.com https://vercel.live wss://*.supabase.co",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Cross-origin isolation headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
