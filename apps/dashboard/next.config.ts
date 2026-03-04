import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @cipta/middleware sudah di-compile ke dist/ — tidak perlu di-transpile ulang
  // (transpiling-nya menyeret viem ~2MB ke dalam webpack bundle)
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
