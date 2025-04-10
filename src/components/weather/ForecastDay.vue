<template>
  <div
    class="border-2 rounded-lg p-3 flex flex-col items-center hover:shadow-md transition-shadow">
    <p class="font-medium">{{ formattedDate }}</p>

    <div class="my-2">
      <WeatherIcon :code="weatherCode" class="w-12 h-12" />
    </div>

    <div class="flex items-center space-x-2 my-1">
      <span class="text-red-500">{{ Math.round(tempMax) }}°</span>
      <span class="text-xs text-gray-400">|</span>
      <span class="text-blue-500">{{ Math.round(tempMin) }}°</span>
    </div>

    <div class="text-xs text-gray-600 mt-1">
      <p>Rain: {{ rainProbability }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import WeatherIcon from "./WeatherIcon.vue";

interface Props {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  formattedDate: string;
}

defineProps<Props>();
</script>
