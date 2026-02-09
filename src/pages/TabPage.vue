<script lang="ts" setup>
import TabSections from '@/components/TabSections.vue';
import { useTabsStore } from '@/stores/tabsStore';

const tabsStore = useTabsStore();
</script>

<template>
  <Container>
    <TabSections v-if="tabsStore.activeTab" :tab-id="tabsStore.activeTab.id" />
  </Container>
</template>
