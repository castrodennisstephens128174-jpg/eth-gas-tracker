<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  value: string
  unit?: string
  hint?: string
  copyable?: boolean
}>()

const justCopied = ref(false)

async function copyValue() {
  if (!props.copyable || props.value === '—') return
  const text = props.unit ? `${props.value} ${props.unit}` : props.value
  try {
    await navigator.clipboard.writeText(text)
    justCopied.value = true
    window.setTimeout(() => (justCopied.value = false), 1400)
  } catch {
    justCopied.value = false
  }
}
</script>

<template>
  <div class="stat">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">
      {{ value }}<small v-if="unit">{{ unit }}</small>
    </span>
    <span class="stat-foot">
      <span v-if="hint" class="stat-hint">{{ hint }}</span>
      <button
        v-if="copyable"
        type="button"
        class="stat-copy"
        :class="{ 'is-copied': justCopied }"
        :aria-label="justCopied ? `Copied ${value} ${unit ?? ''}`.trim() : `Copy ${value} ${unit ?? ''}`.trim()"
        @click="copyValue"
      >
        {{ justCopied ? 'Copied' : 'Copy' }}
      </button>
    </span>
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
.stat-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 22px;
}
.stat-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.stat-copy {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.stat-copy:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.stat-copy.is-copied {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
