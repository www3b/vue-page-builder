<script setup lang="ts">
import { ref } from 'vue';

import ExpansionPanel from '@/components/ui/ExpansionPanel.vue';

type Props = {
  title: string;
};

defineProps<Props>();

const open = ref(false);
</script>

<template>
  <ExpansionPanel :title="title" v-model="open">
    <slot />
  </ExpansionPanel>
</template>
