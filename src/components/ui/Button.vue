<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { RouteLocationRaw } from 'vue-router';
import { RouterLink } from 'vue-router';

defineOptions({
  inheritAttrs: false,
});

type Variant = 'elevated' | 'outlined' | 'text';

type Size = 'sm' | 'md' | 'lg';

type ButtonType = 'button' | 'submit' | 'reset';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | string;

type Props = Partial<{
  variant: Variant;
  color: ButtonColor;
  size: Size;
  block: boolean;
  disabled: boolean;
  loading: boolean;
  href: string;
  to: RouteLocationRaw | '';
  type: ButtonType;
  width: string | number;
}>;

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  color: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  loading: false,
  href: '',
  to: '',
  type: 'button',
  width: '',
});

const attrs = useAttrs();

const isDisabled = computed(() => props.disabled || props.loading);

const componentTag = computed(() => {
  if (props.to) return RouterLink;
  if (props.href) return 'a';
  return 'button';
});

const resolvedColor = computed(() => {
  switch (props.color) {
    case 'primary':
      return 'var(--color-primary)';
    case 'secondary':
      return 'var(--color-secondary)';
    case 'success':
      return 'var(--color-success)';
    case 'info':
      return 'var(--color-info)';
    case 'warning':
      return 'var(--color-warning)';
    case 'error':
      return 'var(--color-error)';
    default:
      return props.color;
  }
});

const resolvedWidth = computed(() => {
  if (props.width === '' || props.width === null || props.width === undefined) return undefined;
  return typeof props.width === 'number' ? `${props.width}px` : props.width;
});

const rootClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--block': props.block,
    'btn--loading': props.loading,
    'btn--disabled': isDisabled.value,
  },
  attrs.class,
]);

const rootStyles = computed(() => [
  {
    '--btn-color': resolvedColor.value,
    width: resolvedWidth.value,
  },
  attrs.style,
]);

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  const base: Record<string, unknown> = { ...rest };

  if (componentTag.value === 'button') {
    base.type = props.type;
    base.disabled = isDisabled.value;
  }

  if (componentTag.value === 'a') {
    base.href = isDisabled.value ? undefined : props.href;
    base.tabindex = isDisabled.value ? -1 : rest.tabindex;
    base['aria-disabled'] = isDisabled.value || undefined;
  }

  if (componentTag.value === RouterLink) {
    base.to = isDisabled.value ? undefined : props.to;
    base.tabindex = isDisabled.value ? -1 : rest.tabindex;
    base['aria-disabled'] = isDisabled.value || undefined;
  }

  base['aria-busy'] = props.loading || undefined;

  return base;
});
</script>

<template>
  <component :is="componentTag" v-bind="rootAttrs" :class="rootClasses" :style="rootStyles">
    <span class="btn__content">
      <slot />
    </span>
    <span class="btn__loader" aria-hidden="true">
      <span class="btn__spinner" />
    </span>
  </component>
</template>

<style scoped>
.btn--active.btn--elevated {
  background: color-mix(in srgb, var(--btn-color) 85%, black);
}

.btn--active.btn--outlined,
.btn--active.btn--text {
  background: color-mix(in srgb, var(--btn-color) 16%, transparent);
}

.btn {
  --btn-height: 2.5rem;
  --btn-padding-x: 1.125rem;
  --btn-font-size: 0.875rem;
  --btn-radius: 0.25rem;
  --btn-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.18);
  align-items: center;
  appearance: none;
  border: none;
  border-radius: var(--btn-radius);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--btn-font-size);
  font-weight: 500;
  height: var(--btn-height);
  justify-content: center;
  letter-spacing: 0.02em;
  min-width: 4rem;
  padding: 0 var(--btn-padding-x);
  position: relative;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.btn::before {
  background: currentColor;
  border-radius: inherit;
  content: '';
  inset: 0;
  opacity: 0;
  position: absolute;
  transition: opacity 0.2s ease;
}

.btn:hover::before {
  opacity: 0.08;
}

.btn:active::before {
  opacity: 0.16;
}

.btn:active {
  transform: translateY(0.0625rem);
}

.btn:focus-visible {
  outline: 0.125rem solid color-mix(in srgb, var(--btn-color) 70%, white);
  outline-offset: 0.125rem;
}

.btn__content {
  align-items: center;
  display: inline-flex;
  position: relative;
  z-index: 1;
}

.btn--block {
  width: 100%;
}

.btn--disabled {
  cursor: not-allowed;
  opacity: 0.38;
  pointer-events: none;
  box-shadow: none;
}

.btn--loading {
  pointer-events: none;
}

.btn__loader {
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: 0;
  position: absolute;
  z-index: 1;
}

.btn--loading .btn__loader {
  opacity: 1;
}

.btn--loading .btn__content {
  opacity: 0;
}

.btn__spinner {
  animation: btn-spin 0.8s linear infinite;
  border: 0.125rem solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
}

.btn--elevated {
  background: var(--btn-color);
  box-shadow: var(--btn-shadow);
  color: #fff;
}

.btn--outlined {
  background: transparent;
  border: 0.0625rem solid color-mix(in srgb, var(--btn-color) 60%, transparent);
  color: var(--btn-color);
  box-shadow: none;
}

.btn--text {
  background: transparent;
  box-shadow: none;
  color: var(--btn-color);
}

.btn--sm {
  --btn-height: 2rem;
  --btn-padding-x: 0.875rem;
  --btn-font-size: 0.8125rem;
}

.btn--md {
  --btn-height: 2.5rem;
  --btn-padding-x: 1.125rem;
  --btn-font-size: 0.875rem;
}

.btn--lg {
  --btn-height: 3rem;
  --btn-padding-x: 1.375rem;
  --btn-font-size: 0.9375rem;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
