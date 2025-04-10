<template>
  <div>
    <h3 class="text-lg font-semibold mb-2 text-gray-700">{{ title }}</h3>
    <ul class="space-y-2 text-gray-600">
      <slot></slot>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
