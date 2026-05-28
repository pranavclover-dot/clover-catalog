/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only packages on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }
    // Exclude puppeteer and chromium from webpack bundling (they use dynamic require)
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      ({ request }, callback) => {
        if (
          request === "puppeteer-core" ||
          request === "@sparticuz/chromium" ||
          request?.startsWith("puppeteer-core/") ||
          request?.startsWith("@sparticuz/chromium/")
        ) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      },
    ];
    return config;
  },
};

export default nextConfig;
