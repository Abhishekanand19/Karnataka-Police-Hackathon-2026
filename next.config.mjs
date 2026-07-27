/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "development" ? "" : "/app",
  assetPrefix: process.env.NODE_ENV === "development" ? "" : "/app",
  distDir: process.env.NODE_ENV === "development" ? ".next" : "out",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
