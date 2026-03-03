import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@cipta/middleware'],
  webpack: (config) => {
    // Suppress peer dependency warnings dari WalletConnect & MetaMask SDK
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    }
    return config
  },
}

export default nextConfig
