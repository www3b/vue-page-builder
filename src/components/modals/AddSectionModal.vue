<script setup lang="ts">
import { ref } from 'vue';

import type { SectionType } from '@/types/sections';

import Modal from '@/components/modals/Modal.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import SelectSectionType from '@/components/forms/SelectSectionType.vue';

import { useSectionsStore } from '@/stores/sectionsStore';
import { useTabsStore } from '@/stores/tabsStore';

type FormModel = {
  sectionName: string;
  sectionType: SectionType | null;
};

const defaultFormData = {
  sectionName: '',
  sectionType: null,
};

const form = ref<FormModel>(defaultFormData);
const errors = ref<Record<keyof FormModel, string | undefined>>({
  sectionName: undefined,
  sectionType: undefined,
});

const sectionsStore = useSectionsStore();
const tabsStore = useTabsStore();

function saveSection(close: () => void) {
  validate(form.value);
  if (form.value.sectionType && form.value.sectionName.trim()) {
    sectionsStore.add({
      type: form.value.sectionType,
      name: form.value.sectionName.trim(),
      tabId: tabsStore.activeTab?.id || 'home',
    });

    close();
  }
}

function validate(data: FormModel) {
  let isInvalid = false;
  errors.value.sectionName = undefined;
  errors.value.sectionType = undefined;

  if (data.sectionName.trim().length === 0) {
    errors.value.sectionName = 'Section name cannot be empty';
    isInvalid = true;
  }

  if (!data.sectionType) {
    errors.value.sectionType = 'Select section type';
    isInvalid = true;
  }

  return isInvalid;
}

function resetForm() {
  form.value.sectionName = '';
  form.value.sectionType = null;
  errors.value.sectionName = undefined;
  errors.value.sectionType = undefined;
}
</script>

<template>
  <Modal
    buttonText="Add Section"
    title="Create new Section"
    @close="resetForm"
    :button-props="{ width: '100%' }"
  >
    <div class="add-section-modal__form">
      <Input
        type="text"
        placeholder="Section name"
        v-model="form.sectionName"
        :error="errors.sectionName"
      />

      <SelectSectionType v-model="form.sectionType" :error="errors.sectionType" />
    </div>

    <template #footer="{ close }">
      <div class="add-section-modal__footer">
        <Button width="100%" variant="elevated" color="error" @click="close">Cancel</Button>

        <Button width="100%" variant="elevated" color="success" @click="saveSection(close)">
          Create
        </Button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.add-section-modal__footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.add-section-modal__form {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
