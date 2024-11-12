/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["vera.blockscout.com", "sourcify.dev"],
  },
  env: {
    NEXT_PUBLIC_WALLET_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID,
  },
};

export default nextConfig;
