/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: () => {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.chiragaggarwal.tech" }],
        destination: "https://www.chiragaggarwal.tech/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.dev.to",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
