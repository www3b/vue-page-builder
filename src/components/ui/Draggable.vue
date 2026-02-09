<script setup lang="ts">
import { onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    index: number;
    isDragging?: boolean;
    isOver?: boolean;
  }>(),
  {
    isDragging: false,
    isOver: false,
  },
);

const emit = defineEmits<{
  (event: 'drag-start', index: number): void;
  (event: 'drag-over', index: number): void;
  (event: 'drop', index: number): void;
  (event: 'drag-end'): void;
}>();

let pointerId: number | null = null;

function isTouchPointer(event: PointerEvent) {
  return event.pointerType === 'touch' || event.pointerType === 'pen';
}

function getIndexFromPoint(event: PointerEvent) {
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const draggable = target?.closest?.('.draggable') as HTMLElement | null;
  const indexAttr = draggable?.dataset.index;
  if (!indexAttr) return null;
  const parsed = Number(indexAttr);
  return Number.isNaN(parsed) ? null : parsed;
}

function onDragStart(_event: DragEvent) {
  emit('drag-start', props.index);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  emit('drag-over', props.index);
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  emit('drop', props.index);
}

function onDragEnd() {
  emit('drag-end');
}

function onPointerDown(event: PointerEvent) {
  if (!isTouchPointer(event)) return;
  pointerId = event.pointerId;
  event.preventDefault();
  emit('drag-start', props.index);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
  window.addEventListener('pointercancel', onPointerUp, { passive: false });
}

function onPointerMove(event: PointerEvent) {
  if (pointerId === null || event.pointerId !== pointerId) return;
  event.preventDefault();
  const targetIndex = getIndexFromPoint(event);
  if (targetIndex === null) return;
  emit('drag-over', targetIndex);
}

function onPointerUp(event: PointerEvent) {
  if (pointerId === null || event.pointerId !== pointerId) return;
  event.preventDefault();
  const targetIndex = getIndexFromPoint(event);
  if (targetIndex !== null) {
    emit('drop', targetIndex);
  }
  emit('drag-end');
  pointerId = null;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
});
</script>

<template>
  <div
    class="draggable"
    :class="{
      'draggable--dragging': isDragging,
      'draggable--over': isOver,
    }"
    :data-index="index"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <button
      class="draggable__handle"
      type="button"
      :draggable="true"
      aria-label="Reorder section"
      @pointerdown="onPointerDown"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
      ⠿
    </button>
    <div class="draggable__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.draggable {
  --draggable-border: #e5e7eb;
  --draggable-bg: #ffffff;
  --draggable-shadow: 0 0.5rem 1.2rem rgba(15, 23, 42, 0.08);
  align-items: center;
  background: var(--draggable-bg);
  border: 0.0625rem solid var(--draggable-border);
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.75rem rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 7px;
  grid-template-columns: auto 1fr;
  position: relative;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.draggable::before {
  content: '';
  height: 0.15rem;
  left: 1rem;
  opacity: 0;
  position: absolute;
  right: 1rem;
  top: -0.6rem;
  transition: opacity 0.2s ease;
}

.draggable--over::before {
  background: linear-gradient(90deg, rgba(24, 103, 192, 0.4), rgba(24, 103, 192, 0.9));
  border-radius: 999px;
  opacity: 1;
}

.draggable--over {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--draggable-border));
  box-shadow: var(--draggable-shadow);
}

.draggable--dragging {
  opacity: 0.6;
  transform: scale(0.98);
}

.draggable__handle {
  margin-left: 7px;
  background: #f8fafc;
  border: 0.0625rem solid #e2e8f0;
  border-radius: 0.5rem;
  color: #94a3b8;
  cursor: grab;
  font-size: 1.125rem;
  line-height: 1;
  padding: 0.35rem 0.45rem;
  touch-action: none;
  user-select: none;
}

.draggable__handle:active {
  cursor: grabbing;
}

.draggable__content {
  width: 100%;
}
</style>
