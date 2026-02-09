<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useTabsStore } from '@/stores/tabsStore';
import { storeToRefs } from 'pinia';

import Header from '@/components/ui/Header.vue';
import AddTabModal from '@/components/modals/AddTabModal.vue';
import TabLink from '@/components/TabLink.vue';
import './main.css';

const tabsStore = useTabsStore();
const { tabsList } = storeToRefs(tabsStore);
</script>

<template>
  <Header>
    <template #actions>
      <AddTabModal />
    </template>
    <TabLink v-for="tab in tabsList" :key="tab.id" :tab="tab" />
  </Header>
  <RouterView />
</template>

<style scoped></style>
