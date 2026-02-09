<script setup lang="ts">
import { ref } from 'vue';

import Modal from '@/components/modals/Modal.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

import { useTabsStore } from '@/stores/tabsStore';

const tabName = ref<string>('');
const error = ref<string>('');

const tabsStore = useTabsStore();

function clearError() {
  error.value = '';
}

function resetForm() {
  tabName.value = '';
  error.value = '';
}

function saveTab(close: () => void) {
  if (!tabName.value.trim()) {
    error.value = 'Tab name cannot be empty';
    return;
  }

  tabsStore.add(tabName.value);
  close();
}
</script>

<template>
  <Modal
    buttonText="Add Tab"
    title="Create new Tab"
    @close="resetForm"
    :button-props="{ variant: 'elevated' }"
  >
    <Input
      type="text"
      placeholder="Tab name"
      v-model="tabName"
      @update:model-value="clearError"
      :error="error"
    />

    <template #footer="{ close }">
      <Button variant="elevated" color="error" width="100%" @click="close">Cancel</Button>
      <Button variant="elevated" color="success" width="100%" @click="saveTab(close)">
        Save
      </Button>
    </template>
  </Modal>
</template>
