<template>
  <li class="flex items-start">
    <span class="font-medium min-w-[140px] mr-1">{{ label }}:</span>
    <span class="flex-1" :class="valueClass">
      <slot>{{ value || "N/A" }}</slot>
    </span>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  valueClass?: string;
}>();
</script>
