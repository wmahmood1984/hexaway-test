import React, { useEffect } from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { bscTestnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const queryClient = new QueryClient()
const projectId = 'b925b1972c5b791221c0f873204ebe63'

const metadata = {
  name: 'Hexaway',
  description: 'AppKit Example',
  url: 'https://hexaway.netlify.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

const networks = [bscTestnet]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

export default function AppKitProvider({ children }) {
  useEffect(() => {
    const initAppKit = async () => {
      await new Promise((r) => setTimeout(r, 300))
      createAppKit({
        adapters: [wagmiAdapter],
        networks,
        projectId,
        metadata,
        features: { analytics: true },
      })
    }
    initAppKit()
  }, [])

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
