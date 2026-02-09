<script setup lang="ts">
import { computed } from 'vue';

import type { TextSectionData } from '@/stores/sectionsStore';

import SectionBlock from '@/components/SectionBlock.vue';
import TextArea from '@/components/ui/TextArea.vue';

import { useSectionsStore } from '@/stores/sectionsStore';

const props = withDefaults(
  defineProps<{
    title?: string;
    sectionId: string;
  }>(),
  {
    title: 'Text',
  },
);

const sectionsStore = useSectionsStore();

const text = computed({
  get() {
    const section = sectionsStore.getSection(props.sectionId);
    return (section?.data as TextSectionData | undefined)?.text ?? '';
  },
  set(value: string) {
    sectionsStore.updateData(props.sectionId, { text: value });
  },
});
</script>

<template>
  <SectionBlock :title="title">
    <TextArea v-model="text" />
  </SectionBlock>
</template>
