<template>
  <div class="mt-4">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">
      News About {{ countryName }}
    </h3>

    <div v-if="loading" class="p-6 text-center">
      <div class="loader mx-auto"></div>
      <p class="mt-2 text-gray-600">
        Scanning global headlines about {{ countryName }}...
      </p>
    </div>

    <ErrorMessage v-else-if="error" :message="error" />

    <ArticlesList v-else :articles="articles" :location-name="countryName" />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import type { Country } from "@/types";
import { useGuardianNews } from "@/composables/useGuardianNews";
import ErrorMessage from "../ErrorMessage.vue";
import ArticlesList from "./ArticlesList.vue";

interface Props {
  country: Country | null;
  countryName: string;
}

const props = defineProps<Props>();
const { articles, loading, error, fetchArticles } = useGuardianNews();

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry) {
      fetchArticles(newCountry.name.common);
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
