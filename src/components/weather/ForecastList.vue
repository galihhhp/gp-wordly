<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
    <ForecastDay
      v-for="(date, index) in forecast.daily.time"
      :key="date"
      :date="date"
      :weather-code="forecast.daily.weathercode[index]"
      :temp-max="forecast.daily.temperature_2m_max[index]"
      :temp-min="forecast.daily.temperature_2m_min[index]"
      :rain-probability="forecast.daily.precipitation_probability_max[index]"
      :formatted-date="formatDate(date)" />
  </div>
</template>

<script setup lang="ts">
import ForecastDay from "./ForecastDay.vue";
import type { WeatherForecast } from "@/composables/useWeatherForecast";

interface Props {
  forecast: WeatherForecast;
  formatDate: (date: string) => string;
}

defineProps<Props>();
</script>
