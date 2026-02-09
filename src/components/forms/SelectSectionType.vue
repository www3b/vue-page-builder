<script setup lang="ts">
import { computed } from 'vue';

import SectionCard from '@/components/SectionCard.vue';

import { INPUT_SECTION, TABLE_SECTION } from '@/data/sections';
import { SectionType } from '@/types/sections';

type Props = {
  error?: string;
};

const props = defineProps<Props>();

const SECTION_TYPES = [INPUT_SECTION, TABLE_SECTION] as const;

const model = defineModel<SectionType | null>({ default: null });

const isInvalid = computed(() => Boolean(props.error));

function set(sectionType: SectionType) {
  model.value = sectionType;
}
</script>

<template>
  <div class="section-cards">
    <SectionCard
      v-for="section in SECTION_TYPES"
      :key="section.type"
      :title="section.name"
      :icon="section.icon"
      :class="{ 'section-card--selected': section.type === model }"
      @click="set(section.type)"
    />
    <span
      class="form-message"
      :class="{ 'form-message--visible': isInvalid, 'form-message--error': isInvalid }"
    >
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.section-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.375rem 1rem;
}
</style>
