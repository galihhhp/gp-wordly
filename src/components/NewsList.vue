<template>
  <div v-if="articles.length" class="mt-8">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">
      News About {{ countryName }}
    </h3>
    <ul class="space-y-4">
      <li
        v-for="article in articles"
        :key="article.url"
        class="p-4 rounded-xl border-2">
        <a :href="article.url" target="_blank" class="block h-full w-full">
          <div>
            <h4 class="font-semibold hover:underline text-xl">
              {{ article.title }}
            </h4>
            <p class="text-gray-600 mt-2">{{ article.description }}</p>
          </div>
        </a>
      </li>
    </ul>
  </div>
  <div v-else class="mt-8 text-gray-600">
    <p>No news articles found for {{ countryName }}.</p>
  </div>
</template>

<script setup lang="ts">
import type { NewsArticle } from "@/types";

defineProps({
  articles: {
    type: Array as () => NewsArticle[],
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
});
</script>
