import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { blockNumber, feeHistory, gasPrice, maxPriorityFeePerGas, type FeeHistory } from '../lib/rpc'
import { hexToBigInt } from '../lib/format'

const REFRESH_MS = 15000

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

  const load = async () => {
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
      error.value = cause instanceof Error ? cause.message : 'Unknown error'
    } finally {
      loading.value = false
      refreshing.value = false
    }
  }

  onMounted(() => {
    void load()
    timer = window.setInterval(() => void load(), REFRESH_MS)
  })

  onUnmounted(() => window.clearInterval(timer))

  return {
    loading,
    refreshing,
    error,
    gasPriceWei,
    priorityFeeWei,
    baseFeeWei,
    latestBlock,
    history,
    updatedAt,
    reload: load
  }
}

function buildHistory(fees: FeeHistory): HistoryPoint[] {
  const oldest = Number(hexToBigInt(fees.oldestBlock))
  return fees.gasUsedRatio.map((ratio, index) => ({
    block: oldest + index,
    baseFee: hexToBigInt(fees.baseFeePerGas[index]),
    gasUsedRatio: ratio
  }))
}
