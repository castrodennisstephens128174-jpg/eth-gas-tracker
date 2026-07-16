# Sepolia Gas Tracker

Live gas price dashboard for the **Ethereum Sepolia testnet**. Read-only — no wallet, no wallet SDK.

## Framework

Vite + Vue 3 (`<script setup>`, Composition API) + TypeScript. Only runtime dependency is `vue`; all RPC calls use plain `fetch`.

## Testnet endpoint

```
https://ethereum-sepolia-rpc.publicnode.com
```

JSON-RPC methods used: `eth_gasPrice`, `eth_maxPriorityFeePerGas`, `eth_feeHistory`, `eth_blockNumber`.

## Folder structure

```
.
├── index.html
├── vite.config.ts
├── env.d.ts
└── src/
    ├── main.ts                 app bootstrap
    ├── App.vue                 page layout, loading / error states
    ├── assets/main.css         global tokens and shared panel styles
    ├── components/
    │   ├── StatCard.vue        single metric tile
    │   ├── FeeHistoryChart.vue base fee bar chart over recent blocks
    │   └── PresetCostTable.vue cost per common transaction preset
    ├── composables/
    │   └── useGasData.ts       polling state: load, refresh, error
    └── lib/
        ├── rpc.ts              JSON-RPC client and typed methods
        ├── format.ts           wei to gwei / ETH, bigint safe
        └── presets.ts          gas limits for common transactions
```

## Features

- Gas price now in gwei, latest base fee, suggested priority fee
- Block utilization and latest block number
- Base fee history chart over the last 20 blocks
- Estimated cost for six common transaction types
- Auto-refresh every 15s, manual refresh button, loading and error states

## Run

```bash
pnpm install
pnpm dev       # dev server
pnpm build     # type check + production build to dist/
pnpm preview   # serve the build
```
