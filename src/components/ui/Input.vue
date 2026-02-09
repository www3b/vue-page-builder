<script setup lang="ts">
import { computed } from 'vue';

type InputType = 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';

type Props = Partial<{
  modelValue: string;
  label: string;
  placeholder: string;
  type: InputType;
  disabled: boolean;
  error: string;
  helper: string;
  name: string;
  id: string;
  required: boolean;
}>;

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  error: '',
  helper: '',
  name: '',
  id: '',
  required: false,
});

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>();

const isInvalid = computed(() => Boolean(props.error));

const rootClasses = computed(() => [
  'input',
  {
    'input--error': isInvalid.value,
    'input--disabled': props.disabled,
  },
]);

const describedBy = computed(() => {
  if (!props.id) return undefined;
  if (isInvalid.value) return `${props.id}-error`;
  if (props.helper) return `${props.id}-helper`;
  return undefined;
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  emit('update:modelValue', target?.value ?? '');
}
</script>

<template>
  <label :class="rootClasses">
    <span v-if="label" class="input__label">{{ label }}</span>
    <input
      class="input__field"
      :id="id || undefined"
      :name="name || undefined"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      @input="onInput"
    />
    <span
      class="form-message"
      :class="{ 'form-message--visible': isInvalid, 'form-message--error': isInvalid }"
    >
      {{ error }}
    </span>
  </label>
</template>

<style scoped>
.input {
  display: grid;
  gap: 0.375rem;
  font-size: 0.875rem;
}

.input__label {
  color: var(--input-muted);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.input__field {
  background: var(--input-bg);
  border: 0.0625rem solid var(--input-border);
  border-radius: 0.5rem;
  color: var(--input-text);
  font-size: 0.95rem;
  padding: 0.625rem 0.75rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input__field::placeholder {
  color: #9aa3ad;
}

.input:focus-within .input__label {
  color: var(--input-focus);
}

.input:focus-within .input__field {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 0.1875rem rgba(24, 103, 192, 0.15);
}

.input--error .input__label {
  color: var(--input-error);
}

.input--error .input__field {
  border-color: var(--input-error);
  box-shadow: 0 0 0 0.1875rem rgba(211, 47, 47, 0.12);
}

.input--disabled {
  opacity: 0.6;
}

.input--disabled .input__field {
  cursor: not-allowed;
}
</style>
