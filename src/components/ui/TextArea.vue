<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef, watch } from 'vue';

const model = defineModel<string>({ default: '' });

const textarea = useTemplateRef('textarea');

function resize() {
  const el = textarea.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

watch(model, () => {
  nextTick(resize);
});

onMounted(() => {
  resize();
});
</script>

<template>
  <textarea
    id="textarea"
    ref="textarea"
    v-model="model"
    class="text-area"
    rows="1"
    placeholder="Enter text"
    @input="resize"
  />
</template>

<style scoped>
.text-area {
  resize: none;
  overflow: hidden;
  width: 100%;
  min-height: 150px;
  height: auto;
  box-sizing: border-box;
  outline: none;
  border-radius: 8px;
  border: 1px solid #888888;
  padding: 10px;
  color: var(--color-text);
  transition: height 0.2s ease;
}
</style>
