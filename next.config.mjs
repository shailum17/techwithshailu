/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.google.com', pathname: '/s2/favicons**' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 't3.gstatic.com' },
    ],
  },
};

export default nextConfig;
