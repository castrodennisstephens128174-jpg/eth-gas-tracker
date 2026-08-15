import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { blockNumber, feeHistory, gasPrice, maxPriorityFeePerGas, type FeeHistory } from '../lib/rpc'
import { hexToBigInt } from '../lib/format'

const REFRESH_MS = 15000
const STALE_MS = 90000

export interface HistoryPoint {
  block: number
  baseFee: bigint
  gasUsedRatio: number
}

export function useGasData() {
  const loading = ref(true)
  const refreshing = ref(false)
  const error = ref<string | null>(null)
  const gasPriceWei = ref<bigint | null>(null)
  const priorityFeeWei = ref<bigint | null>(null)
  const latestBlock = ref<number | null>(null)
  const history = shallowRef<HistoryPoint[]>([])
  const updatedAt = ref<number | null>(null)

  let timer: number | undefined

  const baseFeeWei = computed(() => history.value.at(-1)?.baseFee ?? null)
  const isStale = computed(() => updatedAt.value === null || Date.now() - updatedAt.value > STALE_MS)

  const load = async () => {
    if (document.visibilityState !== 'visible') {
      refreshing.value = false
      return
    }
    refreshing.value = !loading.value
    try {
      const [price, priority, fees, block] = await Promise.all([
        gasPrice(),
        maxPriorityFeePerGas().catch(() => null),
        feeHistory(20),
        blockNumber()
      ])
      gasPriceWei.value = hexToBigInt(price)
      priorityFeeWei.value = priority ? hexToBigInt(priority) : null
      latestBlock.value = Number(hexToBigInt(block))
      history.value = buildHistory(fees)
      updatedAt.value = Date.now()
      error.value = null
    } catch (cause) {
      error.value = humanizeError(cause)
    } finally {
      loading.value = false
      refreshing.value = false
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible') void load()
  }

  onMounted(() => {
    void load()
    timer = window.setInterval(() => void load(), REFRESH_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    window.clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    loading,
    refreshing,
    error,
    isStale,
    gasPriceWei,
    priorityFeeWei,
    baseFeeWei,
    latestBlock,
    history,
    updatedAt,
    refresh: load
  }
}

function buildHistory(fees: FeeHistory): HistoryPoint[] {
  const blocks = fees.baseFeePerGas.map((fee, index) => ({
    block: Number(BigInt(fees.oldestBlock)) + index + 1,
    baseFee: BigInt(fee),
    gasUsedRatio: fees.gasUsedRatio[index] ?? 0
  }))
  return blocks.slice(-20)
}

function humanizeError(cause: unknown): string {
  if (cause instanceof TypeError) {
    return 'Network unavailable — check your connection and retry'
  }
  if (cause instanceof Error) {
    if (/HTTP 5\d\d|HTTP 429/.test(cause.message)) {
      return `RPC overloaded (${cause.message}). Will retry automatically`
    }
    return cause.message
  }
  return 'Unexpected error — retry'
}
