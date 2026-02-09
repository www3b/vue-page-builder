<script setup lang="ts">
import { computed } from 'vue';

import type { TableSectionData } from '@/stores/sectionsStore';

import SectionBlock from '@/components/SectionBlock.vue';
import Table from '@/components/ui/Table.vue';

import { useSectionsStore } from '@/stores/sectionsStore';

const props = withDefaults(
  defineProps<{
    title?: string;
    sectionId: string;
  }>(),
  {
    title: 'Table',
  },
);

const sectionsStore = useSectionsStore();

const tableData = computed({
  get() {
    const section = sectionsStore.getSection(props.sectionId);
    const data = section?.data as TableSectionData | undefined;
    return (
      data ?? {
        columns: ['Column 1'],
        rows: [['']],
      }
    );
  },
  set(value: TableSectionData) {
    sectionsStore.updateData(props.sectionId, value);
  },
});
</script>

<template>
  <SectionBlock :title="title">
    <Table v-model="tableData" />
  </SectionBlock>
</template>
