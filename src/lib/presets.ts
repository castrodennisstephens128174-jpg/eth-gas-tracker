export interface TxPreset {
  name: string
  gasLimit: bigint
  description: string
}

export const TX_PRESETS: TxPreset[] = [
  { name: 'ETH Transfer', gasLimit: 21000n, description: 'Plain value send' },
  { name: 'ERC-20 Transfer', gasLimit: 65000n, description: 'Token transfer' },
  { name: 'ERC-20 Approve', gasLimit: 46000n, description: 'Spender allowance' },
  { name: 'NFT Mint', gasLimit: 150000n, description: 'ERC-721 mint' },
  { name: 'Uniswap Swap', gasLimit: 200000n, description: 'Single-hop swap' },
  { name: 'Contract Deploy', gasLimit: 1200000n, description: 'Medium contract' }
]
