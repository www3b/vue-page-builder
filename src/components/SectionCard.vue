<script setup lang="ts">
type Props = {
  title: string;
  icon: string;
};
defineProps<Props>();
</script>

<template>
  <a class="section-card">
    <component width="100" height="100" :is="icon" />
    <h3>{{ title }}</h3>
  </a>
</template>

<style scoped>
.section-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;
}

.section-card--selected {
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
}
</style>
