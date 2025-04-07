<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <div v-if="error" class="p-6 text-center text-red-500">
      {{ error }}
    </div>

    <div
      v-else-if="!forecast || forecast.daily.time.length === 0"
      class="p-6 text-center text-gray-500">
      Weather forecast data is not available for this location.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
      <div
        v-for="(date, index) in forecast.daily.time"
        :key="date"
        class="border-2 rounded-lg p-3 flex flex-col items-center hover:shadow-md transition-shadow">
        <p class="font-medium">{{ formatDate(date) }}</p>

        <div class="my-2">
          <WeatherIcon
            :code="forecast.daily.weathercode[index]"
            class="w-12 h-12" />
        </div>

        <div class="flex items-center space-x-2 my-1">
          <span class="text-red-500"
            >{{ Math.round(forecast.daily.temperature_2m_max[index]) }}°</span
          >
          <span class="text-xs text-gray-400">|</span>
          <span class="text-blue-500"
            >{{ Math.round(forecast.daily.temperature_2m_min[index]) }}°</span
          >
        </div>

        <div class="text-xs text-gray-600 mt-1">
          <p>
            Rain: {{ forecast.daily.precipitation_probability_max[index] }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import WeatherIcon from "./WeatherIcon.vue";

interface WeatherForecast {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

interface Props {
  forecast: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  locationName: string;
}

const props = defineProps<Props>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
};
</script>
