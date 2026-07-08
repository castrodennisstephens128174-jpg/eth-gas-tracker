<script setup lang="ts">
import { computed } from 'vue'
import { TX_PRESETS } from '../lib/presets'
import { weiToEth, weiToGwei } from '../lib/format'

const props = defineProps<{ gasPriceWei: bigint }>()

const rows = computed(() =>
  TX_PRESETS.map((preset) => {
    const cost = props.gasPriceWei * preset.gasLimit
    return {
      ...preset,
      gasLimitText: preset.gasLimit.toLocaleString('en-US'),
      eth: weiToEth(cost),
      gwei: weiToGwei(cost, 0)
    }
  })
)
</script>

<template>
  <section class="panel">
    <header class="panel-head">
      <h2>Transaction cost presets</h2>
      <p>Estimated at current gas price</p>
    </header>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Gas limit</th>
            <th>Cost (gwei)</th>
            <th>Cost (SepoliaETH)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.name">
            <td>
              <span class="name">{{ row.name }}</span>
              <span class="desc">{{ row.description }}</span>
            </td>
            <td class="num">{{ row.gasLimitText }}</td>
            <td class="num">{{ row.gwei }}</td>
            <td class="num accent">{{ row.eth }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}
th {
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 0 12px 10px;
  font-weight: 500;
}
td {
  padding: 12px;
  border-top: 1px solid var(--border);
  font-size: 0.95rem;
}
.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.accent {
  color: var(--accent);
  font-weight: 600;
}
.name {
  display: block;
  font-weight: 500;
}
.desc {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
