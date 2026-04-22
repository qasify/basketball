import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  /** Avoid bundling native / large deps used only in server actions */
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // Add the port if you're running on localhost with a port
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [
      // {
      //   source: "/((?!api/|login|_next|static|public|assets|images|icons).*)*",
      //   destination: "/login",
      //   permanent: true,
      // },
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
