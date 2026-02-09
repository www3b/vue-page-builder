<script setup lang="ts"></script>

<template>
  <header class="header">
    <div class="header__top">
      <h1 class="header__title">Page Builder</h1>

      <div class="header__actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="header__content">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 1rem;
  border-bottom: 0.0625rem solid #e0e0e0;
}

.header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__content {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  overflow: scroll;
}

.header__actions {
  padding: 0.5rem 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
