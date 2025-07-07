/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // 启用CSS Modules
  cssModules: true,
  // 优化图片和字体
  images: {
    domains: ['localhost'],
  },
  // 启用SWC编译器
  swcMinify: true,
  // 环境变量
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Webpack配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加对worker的支持
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
        },
      },
    });
    
    return config;
  },
};

module.exports = nextConfig;
