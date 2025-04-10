<template>
  <div
    class="h-auto min-h-96 border-2 text-black border-black rounded-2xl flex flex-col items-center justify-center mb-8 p-8">
    <h1 class="text-4xl font-bold mb-6">{{ title }}</h1>
    <p class="text-lg mb-8 text-center max-w-2xl">{{ description }}</p>

    <div class="w-full max-w-3xl">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
          {{ techStackTitle }}
        </h2>
        <div class="flex flex-wrap gap-3 justify-center">
          <span
            v-for="(tech, index) in techStack"
            :key="`tech-${index}`"
            class="px-3 py-1 border-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors">
            {{ tech }}
          </span>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
          {{ apisTitle }}
        </h2>
        <div class="flex flex-wrap gap-3 justify-center">
          <span
            v-for="(api, index) in apis"
            :key="`api-${index}`"
            class="px-3 py-1 border-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
            >{{ api }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-8 text-sm opacity-70">{{ ctaText }}</div>
  </div>
</template>

<script setup lang="ts">
interface BannerProps {
  title?: string;
  description?: string;
  techStackTitle?: string;
  techStack?: string[];
  apisTitle?: string;
  apis?: string[];
  ctaText?: string;
}

withDefaults(defineProps<BannerProps>(), {
  title: "GP Wordly",
  description:
    "Explore countries around the world with comprehensive information about their geography, current weather, local time, latest news, and beautiful photos.",
  techStackTitle: "Built With",
  techStack: () => ["Vue.js 3", "TypeScript", "Tailwind CSS"],
  apisTitle: "Powered By",
  apis: () => [
    "REST Countries API",
    "The Guardian API",
    "Unsplash API",
    "Open Meteo API",
  ],
  ctaText: "Select a country below to get started",
});
</script>
