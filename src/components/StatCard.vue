<script setup lang="ts">
defineProps<{
  label: string
  value: string
  unit?: string
  hint?: string
}>()
</script>

<template>
  <div class="stat">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">
      {{ value }}<small v-if="unit">{{ unit }}</small>
    </span>
    <span v-if="hint" class="stat-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
}
.stat-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
.stat-value {
  font-size: 1.9rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.stat-value small {
  font-size: 0.9rem;
  margin-left: 4px;
  color: var(--text-muted);
}
.stat-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
