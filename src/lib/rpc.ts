export const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'

type RpcResponse<T> = { result?: T; error?: { message: string } }

let requestId = 0

export async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++requestId, method, params })
  })
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`)
  const payload = (await response.json()) as RpcResponse<T>
  if (payload.error) throw new Error(payload.error.message)
  if (payload.result === undefined) throw new Error('Empty RPC result')
  return payload.result
}

export interface FeeHistory {
  oldestBlock: string
  baseFeePerGas: string[]
  gasUsedRatio: number[]
  reward?: string[][]
}

export function gasPrice(): Promise<string> {
  return rpc<string>('eth_gasPrice')
}

export function maxPriorityFeePerGas(): Promise<string> {
  return rpc<string>('eth_maxPriorityFeePerGas')
}

export function feeHistory(blocks = 20): Promise<FeeHistory> {
  return rpc<FeeHistory>('eth_feeHistory', [`0x${blocks.toString(16)}`, 'latest', [10, 50, 90]])
}

export function blockNumber(): Promise<string> {
  return rpc<string>('eth_blockNumber')
}
