<script setup lang="ts">
import { ref, watch } from 'vue';

import Button from '@/components/ui/Button.vue';

export type TableData = {
  columns: string[];
  rows: string[][];
};

const model = defineModel<TableData>({
  default: () => ({
    columns: ['Column 1'],
    rows: [['']],
  }),
});

const columns = ref<string[]>([]);
const rows = ref<string[][]>([]);
let skipEmit = false;

function normalizeRows(targetRows: string[][], colCount: number) {
  return targetRows.map((row) => {
    const next = [...row];
    while (next.length < colCount) next.push('');
    if (next.length > colCount) next.length = colCount;
    return next;
  });
}

function syncFromModel() {
  skipEmit = true;
  columns.value = [...model.value.columns];
  rows.value = normalizeRows(model.value.rows, model.value.columns.length);
  skipEmit = false;
}

function emitChange() {
  if (skipEmit) return;
  model.value = {
    columns: [...columns.value],
    rows: rows.value.map((row) => [...row]),
  };
}

watch(
  model,
  () => {
    syncFromModel();
  },
  { deep: true, immediate: true },
);

watch(
  () => columns.value.length,
  (length) => {
    skipEmit = true;
    rows.value = normalizeRows(rows.value, length);
    skipEmit = false;
    emitChange();
  },
);

watch(
  [columns, rows],
  () => {
    emitChange();
  },
  { deep: true, flush: 'sync' },
);

function addColumn() {
  const index = columns.value.length + 1;
  columns.value.push(`Column ${index}`);
  rows.value = normalizeRows(rows.value, columns.value.length);
  emitChange();
}

function addRow() {
  const newRow = Array.from({ length: columns.value.length }, () => '');
  rows.value.push(newRow);
  emitChange();
}
</script>

<template>
  <div class="editable-table">
    <div class="editable-table__actions">
      <Button variant="outlined" size="sm" @click="addRow">Add row</Button>
      <Button variant="outlined" size="sm" @click="addColumn">Add column</Button>
    </div>

    <div class="editable-table__wrapper">
      <table class="editable-table__table">
        <thead>
          <tr>
            <th v-for="(header, index) in columns" :key="`header-${index}`">
              <input
                v-model="columns[index]"
                class="editable-table__input editable-table__input--header"
                type="text"
                placeholder="Header"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="`row-${rowIndex}`">
            <td v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`">
              <input
                v-if="rows[rowIndex]"
                v-model="rows[rowIndex][colIndex]"
                class="editable-table__input"
                type="text"
                placeholder=""
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.editable-table {
  display: grid;
  gap: 1rem;
}

.editable-table__actions {
  display: flex;
  gap: 0.75rem;
}

.editable-table__wrapper {
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: auto;
}

.editable-table__table {
  border-collapse: collapse;
  width: 100%;
  min-width: 28rem;
}

.editable-table__table th,
.editable-table__table td {
  border-bottom: 0.0625rem solid #edf0f3;
  padding: 0.5rem;
  text-align: left;
}

.editable-table__input {
  background: transparent;
  border: 0.0625rem solid transparent;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  padding: 0.4rem 0.5rem;
  width: 100%;
}

.editable-table__input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--color-primary) 30%, white);
  box-shadow: 0 0 0 0.025rem color-mix(in srgb, var(--color-primary) 15%, white);
}

.editable-table__input--header {
  font-weight: 600;
  color: #1f2933;
}
</style>
