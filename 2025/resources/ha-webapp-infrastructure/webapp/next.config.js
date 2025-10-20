/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    APP_NAME: process.env.APP_NAME || 'webapp',
  },
}

module.exports = nextConfig