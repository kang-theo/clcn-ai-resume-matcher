/** @type {import('next').NextConfig} */
const { NEXT_PUBLIC_BASE_PATH = "", BASE_PATH = "" } = process.env;

const nextConfig = {
  reactStrictMode: true,
  basePath: NEXT_PUBLIC_BASE_PATH,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        basePath: false,
        destination: `/jobs`,
        permanent: true, // Use `false` for temporary redirects
      },
      {
        source: "/admin",
        basePath: false,
        destination: "/admin/dashboard",
        permanent: true, // Use `false` for temporary redirects
      },
    ];
  },
};

export default nextConfig;
