import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  redirects: () => {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      // {
      //   source: "/:path*",
      //   has: [{ type: "host", value: "www.chiragaggarwal.tech" }],
      //   destination: "https://www.chiragaggarwal.tech/:path*",
      //   permanent: true,
      // },
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

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
