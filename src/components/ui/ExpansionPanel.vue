<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  modelValue?: boolean;
  title?: string;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  disabled: false,
});

const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div
    class="expansion-panel"
    :class="{ 'expansion-panel--open': isOpen, 'expansion-panel--disabled': disabled }"
  >
    <button
      class="expansion-panel__header"
      type="button"
      :aria-expanded="isOpen"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="expansion-panel__title">{{ title }}</span>
      <span class="expansion-panel__icon" aria-hidden="true">▾</span>
    </button>

    <Transition name="expansion">
      <div v-show="isOpen" class="expansion-panel__body">
        <div class="expansion-panel__content">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expansion-panel {
  background: #fff;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0rem 0.5rem 0.5rem 0;
  display: grid;
}

.expansion-panel__header {
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: 0.95rem;
  font-weight: 600;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  text-align: left;
  width: 100%;
}

.expansion-panel__title {
  color: #1f2933;
}

.expansion-panel__icon {
  color: #6b7280;
  display: inline-flex;
  transition: transform 0.2s ease;
}

.expansion-panel__body {
  overflow: hidden;
}

.expansion-panel__content {
  color: #4b5563;
  padding: 0 1rem 1rem;
}

.expansion-panel--open .expansion-panel__icon {
  transform: rotate(180deg);
}

.expansion-panel--disabled {
  opacity: 0.6;
}

.expansion-panel--disabled .expansion-panel__header {
  cursor: not-allowed;
}

.expansion-enter-active,
.expansion-leave-active {
  transition:
    max-height 0.2s ease,
    opacity 0.2s ease;
}

.expansion-enter-from,
.expansion-leave-to {
  max-height: 0;
  opacity: 0;
}

.expansion-enter-to,
.expansion-leave-from {
  max-height: 20rem;
  opacity: 1;
}
</style>
