<template>
  <div v-if="articles.length" class="mt-8">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">
      News About {{ countryName }}
    </h3>
    <ul class="space-y-4">
      <li
        v-for="article in articles"
        :key="article.webUrl"
        class="p-4 rounded-xl border-2">
        <a :href="article.webUrl" target="_blank" class="block h-full w-full">
          <div>
            <h4 class="font-semibold hover:underline text-xl">
              {{ article.webTitle }}
            </h4>
            <p class="text-gray-600 mt-2">{{ article.fields?.trailText }}</p>
            <div
              class="flex justify-between items-center mt-3 text-sm text-gray-500">
              <span>{{ formatDate(article.webPublicationDate) }}</span>
              <span>The Guardian</span>
            </div>
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
import type { GuardianArticle } from "@/types";

defineProps({
  articles: {
    type: Array as () => GuardianArticle[],
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
