<script setup lang="ts">
import { ref } from 'vue';

import Button from '@/components/ui/Button.vue';

type ButtonProps = Partial<InstanceType<typeof Button>['$props']>;

type Props = {
  buttonText?: string;
  title?: string;
  buttonProps?: ButtonProps;
};

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Open modal',
  title: 'Modal',
  buttonProps: () => ({}),
});

const emit = defineEmits<{ (event: 'close'): void }>();

const isOpen = ref(false);

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
  emit('close');
}
</script>

<template>
  <Button variant="outlined" v-bind="props.buttonProps" @click="open">
    {{ buttonText }}
  </Button>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal modal--open" @click.self="close">
        <div class="modal__window" role="dialog" aria-modal="true" :aria-label="title">
          <header class="modal__header">
            <span class="modal__title">{{ title }}</span>
            <button class="modal__close" type="button" aria-label="Close modal" @click="close">
              ✕
            </button>
          </header>
          <div class="modal__body">
            <slot>Modal content</slot>
          </div>
          <footer class="modal__footer">
            <slot name="footer" :close="close">
              <Button variant="text" @click="close">Close</Button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1.5rem;
  position: fixed;
  z-index: 1000;
}

.modal__window {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.75rem 1.75rem rgba(0, 0, 0, 0.2);
  max-width: 26.25rem;
  width: 100%;
}

.modal__header,
.modal__footer {
  align-items: center;
  border-bottom: 0.0625rem solid #e6e6e6;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0.75rem 1rem;
}

.modal__title {
  font-size: 0.95rem;
  font-weight: 600;
}

.modal__close {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 1rem;
}

.modal__body {
  padding: 1rem;
  font-size: 0.9rem;
  color: #333;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal__window,
.modal-leave-active .modal__window {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.modal-enter-from .modal__window,
.modal-leave-to .modal__window {
  opacity: 0;
  transform: translateY(0.75rem) scale(0.98);
}
</style>
