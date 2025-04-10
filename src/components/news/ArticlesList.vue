<template>
  <ul v-if="articles.length" class="space-y-4">
    <ArticleItem
      v-for="article in articles"
      :key="article.webUrl"
      :article="article" />
  </ul>

  <div v-else class="text-gray-600 p-4 rounded-lg bg-gray-100">
    <p>No news articles found for {{ locationName }}.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { GuardianArticle } from "@/types";
import ArticleItem from "./ArticleItem.vue";

interface Props {
  articles: GuardianArticle[];
  locationName: string;
}

defineProps<Props>();
</script>
