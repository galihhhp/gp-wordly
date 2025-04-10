<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <div v-if="loading" class="p-6 text-center">
      <div class="loader mx-auto"></div>
      <p class="mt-2 text-gray-600">
        Predicting raindrops and sunshine for you...
      </p>
    </div>

    <ErrorMessage v-else-if="error" :message="error" />

    <div
      v-else-if="!forecast || forecast.daily.time.length === 0"
      class="p-6 text-center text-gray-500">
      Weather forecast data is not available for this location.
    </div>

    <ForecastList v-else :forecast="forecast" :format-date="formatDate" />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import type { Country } from "@/types";
import { useWeatherForecast } from "@/composables/useWeatherForecast";
import ErrorMessage from "../ErrorMessage.vue";
import ForecastList from "./ForecastList.vue";

interface Props {
  country: Country | null;
  locationName: string;
}

const props = defineProps<Props>();

const { forecast, loading, error, fetchForecast, formatDate } =
  useWeatherForecast();

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry) {
      fetchForecast(newCountry);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.loader {
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #000;
  box-shadow: 0 0 0 0 #0004;
  animation: l1 1s infinite;
}
@keyframes l1 {
  100% {
    box-shadow: 0 0 0 30px #0000;
  }
}
</style>
