const WEI_PER_GWEI = 1_000_000_000n
const WEI_PER_ETH = 1_000_000_000_000_000_000n

export function weiToGwei(wei: bigint, decimals = 3): string {
  return formatUnits(wei, WEI_PER_GWEI, decimals)
}

export function weiToEth(wei: bigint, decimals = 6): string {
  return formatUnits(wei, WEI_PER_ETH, decimals)
}

function formatUnits(value: bigint, unit: bigint, decimals: number): string {
  const whole = value / unit
  const remainder = value % unit
  if (decimals === 0) return whole.toString()
  const scaled = (remainder * 10n ** BigInt(decimals)) / unit
  const fraction = scaled.toString().padStart(decimals, '0').replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : whole.toString()
}

export function hexToBigInt(hex: string): bigint {
  return BigInt(hex)
}
