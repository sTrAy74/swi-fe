/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
          },
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
          },
          {
            protocol: 'https',
            hostname: 'videos.pexels.com',
          },
          {
            protocol: 'https',
            hostname: 'competent-ducks-d5b0fe6401.media.strapiapp.com',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
