<script setup lang="ts">
import { computed } from 'vue'
import type { HistoryPoint } from '../composables/useGasData'
import { weiToGwei } from '../lib/format'

const props = defineProps<{ points: HistoryPoint[] }>()

const bars = computed(() => {
  const max = props.points.reduce((peak, point) => (point.baseFee > peak ? point.baseFee : peak), 1n)
  return props.points.map((point) => ({
    block: point.block,
    gwei: weiToGwei(point.baseFee, 4),
    used: Math.round(point.gasUsedRatio * 100),
    height: Number((point.baseFee * 100n) / max)
  }))
})
</script>

<template>
  <section class="panel">
    <header class="panel-head">
      <h2>Base fee history</h2>
      <p>Last {{ bars.length }} blocks</p>
    </header>
    <div class="chart">
      <div
        v-for="bar in bars"
        :key="bar.block"
        class="bar"
        :style="{ height: `${Math.max(bar.height, 2)}%` }"
        :title="`Block ${bar.block} — ${bar.gwei} gwei — ${bar.used}% used`"
      />
    </div>
    <div class="axis">
      <span>{{ bars[0]?.block }}</span>
      <span>{{ bars.at(-1)?.block }}</span>
    </div>
  </section>
</template>

<style scoped>
.chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 160px;
}
.bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, var(--accent), rgba(99, 102, 241, 0.25));
  transition: height 0.3s ease;
}
.bar:hover {
  background: var(--accent);
}
.axis {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
