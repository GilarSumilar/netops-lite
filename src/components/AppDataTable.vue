<template>
  <div class="flex flex-col gap-3">
    <!-- Toolbar: search + per-page -->
    <div v-if="searchable || showPageSize" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div v-if="searchable" class="relative w-full sm:max-w-xs">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted pointer-events-none">search</span>
        <input v-model="localSearch" type="text" :placeholder="searchPlaceholder"
          class="w-full h-10 pl-9 pr-3 rounded-lg border border-border-default bg-surface-base font-body-md text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container" />
      </div>
      <div v-if="showPageSize" class="flex items-center gap-2 shrink-0">
        <span class="font-body-sm text-body-sm text-text-muted whitespace-nowrap">Tampil</span>
        <select v-model="localPageSize"
          class="h-9 px-2 rounded-lg border border-border-default bg-surface-base font-body-sm text-body-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container/20">
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
        <span class="font-body-sm text-body-sm text-text-muted whitespace-nowrap">data</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-surface-base rounded-xl border border-border-subtle overflow-x-auto">
      <table class="w-full min-w-[540px]">
        <thead>
          <tr class="border-b border-border-subtle bg-surface-container-low">
            <th v-for="col in columns" :key="col.key"
              :class="['text-left px-4 py-3 font-label-md text-label-md text-text-muted whitespace-nowrap', col.thClass || '']">
              {{ col.label }}
            </th>
            <th v-if="hasActions" class="text-left px-4 py-3 font-label-md text-label-md text-text-muted w-px whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle">
          <tr v-for="row in paged" :key="rowKey(row)" class="hover:bg-surface-container-low transition-colors">
            <td v-for="col in columns" :key="col.key" :class="['px-4 py-3', col.tdClass || '']">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                <span class="font-body-md text-body-md text-text-primary">{{ row[col.key] }}</span>
              </slot>
            </td>
            <td v-if="hasActions" class="px-4 py-3">
              <div class="flex items-center gap-1">
                <slot name="actions" :row="row" />
              </div>
            </td>
          </tr>
          <tr v-if="!paged.length">
            <td :colspan="columns.length + (hasActions ? 1 : 0)"
              class="px-4 py-10 text-center font-body-md text-body-md text-text-muted">
              Tidak ada data ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination footer -->
    <div v-if="filtered.length > 0" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p class="font-body-sm text-body-sm text-text-muted">
        Menampilkan {{ rangeStart }}–{{ rangeEnd }} dari {{ filtered.length }} data
      </p>
      <div class="flex items-center gap-1">
        <button @click="page = 1" :disabled="page === 1" type="button"
          class="p-1.5 rounded-lg text-text-muted hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <span class="material-symbols-outlined text-[18px]">first_page</span>
        </button>
        <button @click="page--" :disabled="page === 1" type="button"
          class="p-1.5 rounded-lg text-text-muted hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <template v-for="p in pageNumbers" :key="p">
          <span v-if="p === '...'" class="px-1 text-text-muted font-body-sm">…</span>
          <button v-else @click="page = p" type="button"
            :class="['w-8 h-8 rounded-lg font-label-md text-label-md transition-colors',
              p === page ? 'bg-primary-container text-on-primary shadow-sm' : 'text-text-body hover:bg-surface-container-low']">
            {{ p }}
          </button>
        </template>
        <button @click="page++" :disabled="page === totalPages" type="button"
          class="p-1.5 rounded-lg text-text-muted hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
        <button @click="page = totalPages" :disabled="page === totalPages" type="button"
          class="p-1.5 rounded-lg text-text-muted hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <span class="material-symbols-outlined text-[18px]">last_page</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, useSlots } from 'vue'

const props = defineProps({
  columns:           { type: Array,   required: true },
  rows:              { type: Array,   default: () => [] },
  search:            { type: String,  default: null },
  searchable:        { type: Boolean, default: false },
  searchPlaceholder: { type: String,  default: 'Cari...' },
  searchKeys:        { type: Array,   default: null },
  pageSize:          { type: Number,  default: 10 },
  showPageSize:      { type: Boolean, default: true },
  pageSizeOptions:   { type: Array,   default: () => [5, 10, 25, 50] },
  rowIdKey:          { type: String,  default: 'id' },
})

const slots         = useSlots()
const hasActions    = computed(() => !!slots.actions)
const localSearch   = ref('')
const localPageSize = ref(props.pageSize)
const page          = ref(1)

watch([localSearch, localPageSize, () => props.search, () => props.rows], () => { page.value = 1 })

const activeSearch = computed(() => props.search !== null ? props.search : localSearch.value)

const filtered = computed(() => {
  const q = activeSearch.value?.toLowerCase().trim()
  if (!q) return props.rows
  const keys = props.searchKeys || props.columns.map(c => c.key)
  return props.rows.filter(row => keys.some(k => String(row[k] ?? '').toLowerCase().includes(q)))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / localPageSize.value)))
const rangeStart = computed(() => filtered.value.length === 0 ? 0 : (page.value - 1) * localPageSize.value + 1)
const rangeEnd   = computed(() => Math.min(page.value * localPageSize.value, filtered.value.length))
const paged      = computed(() => filtered.value.slice(rangeStart.value - 1, rangeEnd.value))

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur   = page.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 4)          return [1, 2, 3, 4, 5, '...', total]
  if (cur >= total - 3)  return [1, '...', total-4, total-3, total-2, total-1, total]
  return [1, '...', cur-1, cur, cur+1, '...', total]
})

function rowKey(row) { return row[props.rowIdKey] ?? JSON.stringify(row) }
</script>
