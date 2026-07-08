<script setup lang="ts">
import { computed } from 'vue'
import { useGasData } from './composables/useGasData'
import { weiToGwei } from './lib/format'
import { RPC_URL } from './lib/rpc'
import StatCard from './components/StatCard.vue'
import PresetCostTable from './components/PresetCostTable.vue'
import FeeHistoryChart from './components/FeeHistoryChart.vue'

const {
  loading,
  refreshing,
  error,
  gasPriceWei,
  priorityFeeWei,
  baseFeeWei,
  latestBlock,
  history,
  updatedAt,
  reload
} = useGasData()

const gweiNow = computed(() => (gasPriceWei.value === null ? '—' : weiToGwei(gasPriceWei.value)))
const baseFee = computed(() => (baseFeeWei.value === null ? '—' : weiToGwei(baseFeeWei.value)))
const priorityFee = computed(() =>
  priorityFeeWei.value === null ? 'n/a' : weiToGwei(priorityFeeWei.value)
)
const congestion = computed(() => {
  const last = history.value.at(-1)
  return last ? `${Math.round(last.gasUsedRatio * 100)}%` : '—'
})
const updatedLabel = computed(() =>
  updatedAt.value ? new Date(updatedAt.value).toLocaleTimeString('en-US') : '—'
)
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div>
        <h1>Sepolia Gas Tracker</h1>
        <p class="sub">Live gas prices on the Ethereum Sepolia testnet</p>
      </div>
      <button :disabled="refreshing || loading" @click="reload">
        {{ refreshing ? 'Refreshing…' : 'Refresh' }}
      </button>
    </header>

    <p v-if="error" class="alert">Failed to load gas data: {{ error }}</p>

    <template v-if="loading">
      <div class="skeleton-grid">
        <div v-for="n in 4" :key="n" class="skeleton" />
      </div>
      <p class="loading-text">Loading live data…</p>
    </template>

    <template v-else>
      <div class="grid">
        <StatCard label="Gas price now" :value="gweiNow" unit="gwei" hint="eth_gasPrice" />
        <StatCard label="Base fee" :value="baseFee" unit="gwei" hint="Latest block" />
        <StatCard label="Priority fee" :value="priorityFee" unit="gwei" hint="Suggested tip" />
        <StatCard
          label="Block utilization"
          :value="congestion"
          :hint="latestBlock ? `Block #${latestBlock}` : undefined"
        />
      </div>

      <FeeHistoryChart v-if="history.length" :points="history" />
      <PresetCostTable v-if="gasPriceWei !== null" :gas-price-wei="gasPriceWei" />
    </template>

    <footer>
      <span>RPC: {{ RPC_URL }}</span>
      <span>Updated {{ updatedLabel }} · auto-refresh 15s</span>
    </footer>
  </div>
</template>

<style scoped>
.app {
  max-width: 1040px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
h1 {
  margin: 0;
  font-size: 1.9rem;
  letter-spacing: -0.02em;
}
.sub {
  margin: 6px 0 0;
  color: var(--text-muted);
}
button {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
}
button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
.alert {
  margin: 0;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}
.grid,
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.skeleton {
  height: 118px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  animation: pulse 1.4s ease-in-out infinite;
}
.loading-text {
  color: var(--text-muted);
  margin: 0;
}
@keyframes pulse {
  50% {
    opacity: 0.45;
  }
}
footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  padding-top: 16px;
}
</style>
