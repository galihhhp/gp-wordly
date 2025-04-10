<template>
  <div>
    <ErrorMessage v-if="error" :message="error" />

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-3 border-2 rounded-xl">
        <div class="text-sm mb-1">UTC</div>
        <div class="text-2xl font-mono font-semibold">{{ utcTime }}</div>
      </div>

      <div class="p-3 border-2 rounded-xl">
        <div class="text-sm mb-1">Your Local Time</div>
        <div class="text-2xl font-mono font-semibold">{{ localTime }}</div>
      </div>

      <div class="p-3 border-2 rounded-xl">
        <div class="text-sm mb-1">
          {{ country ? country.name.common : "Selected Country" }} Time
        </div>
        <div class="text-2xl font-mono font-semibold">
          {{ countryTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import type { Country } from "@/types";
import ErrorMessage from "./ErrorMessage.vue";

interface Props {
  country: Country | null;
}

const props = defineProps<Props>();
const currentTime = ref(new Date());
const error = ref<string | null>(null);
let intervalId: number | null = null;

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const utcTime = computed(() => {
  const date = new Date(currentTime.value);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
});

const localTime = computed(() => {
  return formatTime(currentTime.value);
});

const countryTime = computed(() => {
  if (!props.country?.timezones?.length) {
    return "Timezone unavailable";
  }

  try {
    const timezone = props.country.timezones[0];

    return currentTime.value.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: normalizeTimezone(timezone),
    });
  } catch (error) {
    return "Time unavailable";
  }
});

const normalizeTimezone = (timezone: string): string => {
  if (timezone.startsWith("UTC")) {
    const match = timezone.match(/UTC([+-])(\d{2}):?(\d{2})?/);
    if (match) {
      const sign = match[1] === "+" ? "-" : "+";
      const hours = parseInt(match[2], 10);
      return `Etc/GMT${sign}${hours}`;
    }
  }

  return timezone;
};

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry && !newCountry.timezones?.length) {
      error.value = "Timezone information unavailable for this country";
    } else {
      error.value = null;
    }
  },
  { immediate: true }
);
</script>
