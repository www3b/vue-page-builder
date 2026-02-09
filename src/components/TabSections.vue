<script setup lang="ts">
import { computed, ref } from 'vue';

import Draggable from '@/components/ui/Draggable.vue';
import AddSectionModal from '@/components/modals/AddSectionModal.vue';

import { useSectionsStore } from '@/stores/sectionsStore';
import { mapSectionToComponent } from '@/utils';

type Props = {
  tabId: string;
};

const props = defineProps<Props>();

const sectionsStore = useSectionsStore();
const sections = computed(() => sectionsStore.tabSectionMap[props.tabId] ?? []);

const draggingIndex = ref<number | null>(null);
const overIndex = ref<number | null>(null);

function handleDragStart(index: number) {
  draggingIndex.value = index;
}

function handleDragOver(index: number) {
  if (overIndex.value !== index) {
    overIndex.value = index;
  }
}

function handleDrop(index: number) {
  if (draggingIndex.value === null) return;
  sectionsStore.moveSection(props.tabId, draggingIndex.value, index);
  draggingIndex.value = null;
  overIndex.value = null;
}

function handleDragEnd() {
  draggingIndex.value = null;
  overIndex.value = null;
}
</script>

<template>
  <div class="sections-container">
    <AddSectionModal />
    <div class="sections-container__list">
      <Draggable
        v-for="(section, index) in sections"
        :key="section.id"
        :index="index"
        :is-dragging="draggingIndex === index"
        :is-over="overIndex === index"
        @drag-start="handleDragStart"
        @drag-over="handleDragOver"
        @drop="handleDrop"
        @drag-end="handleDragEnd"
      >
        <component
          :is="mapSectionToComponent(section.type)"
          :section-id="section.id"
          :title="section.name"
        />
      </Draggable>
    </div>
  </div>
</template>

<style scoped>
.sections-container {
  display: grid;
  gap: 1.25rem;
}

.sections-container__list {
  display: grid;
  gap: 1rem;
}
</style>
