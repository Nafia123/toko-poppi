/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate')

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/pall',
        locale:true
      }
    ]
  }
}

module.exports = nextTranslate({
  nextConfig
})
