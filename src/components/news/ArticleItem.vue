<template>
  <li class="p-4 rounded-xl border-2">
    <a :href="article.webUrl" target="_blank" class="block h-full w-full">
      <div>
        <h4 class="font-semibold hover:underline text-xl">
          {{ article.webTitle }}
        </h4>
        <p class="text-gray-600 mt-2">{{ article.fields?.trailText }}</p>
        <div
          class="flex justify-between items-center mt-3 text-sm text-gray-500">
          <span>{{ formattedDate }}</span>
          <span>The Guardian</span>
        </div>
      </div>
    </a>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { GuardianArticle } from "@/types";

interface Props {
  article: GuardianArticle;
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
  const date = new Date(props.article.webPublicationDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
</script>
