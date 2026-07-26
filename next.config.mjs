const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: process.env.NODE_ENV === "development" ? "" : "/app",
  assetPrefix: process.env.NODE_ENV === "development" ? "" : "/app",
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: { unoptimized: true },
};

export default nextConfig;
