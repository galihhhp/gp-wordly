<template>
  <div class="min-h-screen p-4 container mx-auto">
    <div
      v-if="!countryDetails"
      class="h-96 bg-red-400 text-white font-bold text-2xl rounded-2xl flex items-center justify-center mb-8">
      Select a Country
    </div>

    <CountryMap v-else :country="countryDetails" class="mb-8" />

    <div class="mb-6">
      <label
        for="country-select"
        class="block text-lg font-medium mb-2 text-gray-700">
        Select a Country:
      </label>
      <Select
        :options="countryOptions"
        placeholder="Select a country"
        @update:modelValue="
          async (value) => {
            await handleCountrySelect(value as string);
          }
        " />
    </div>

    <div
      v-if="countriesLoading || countryDetailsLoading || newsLoading"
      class="flex justify-center py-12">
      <div class="loader"></div>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-6">
      <div class="flex-1">
        <div
          v-if="countryDetailsError"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-4">
          <p>Error loading country details: {{ countryDetailsError }}</p>
        </div>
        <CountryDetails v-else-if="countryDetails" :country="countryDetails" />
      </div>

      <div class="w-full md:w-1/4">
        <div
          v-if="newsError"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-4">
          <p>Error loading news: {{ newsError }}</p>
        </div>
        <NewsList
          v-else-if="newsArticles.length"
          :articles="newsArticles"
          :countryName="countryDetails?.name.common || ''" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useFetch } from "@/utils/useFetch";
import CountryDetails from "@/components/CountryDetails.vue";
import NewsList from "@/components/NewsList.vue";
import Select from "@/components/Select.vue";
import CountryMap from "@/components/CountryMap.vue";
import type { Country, NewsArticle } from "@/types";

const countries = ref<Country[]>([]);
const selectedCountry = ref<string>("");
const countryDetails = ref<Country | null>(null);
const newsArticles = ref<NewsArticle[]>([]);

const {
  data: countriesData,
  loading: countriesLoading,
  error: countriesError,
} = useFetch<Country[]>("https://restcountries.com/v3.1/all");

const {
  data: countryDetailsData,
  loading: countryDetailsLoading,
  error: countryDetailsError,
  fetchData: fetchCountryDetails,
} = useFetch<Country | null>(null);

const {
  data: newsData,
  loading: newsLoading,
  error: newsError,
  fetchData: fetchNews,
} = useFetch<{ articles: NewsArticle[] }>(null);

const countryOptions = computed(() =>
  countries.value.map((country) => ({
    value: country.cca3,
    label: country.name.common,
  }))
);

watch(
  () => countriesData.value,
  (newData) => {
    if (newData) countries.value = newData;
  }
);

const handleCountrySelect = async (countryCode: string) => {
  selectedCountry.value = countryCode;

  const countryUrl = `https://restcountries.com/v3.1/alpha/${selectedCountry}`;
  fetchCountryDetails(countryUrl);

  newsArticles.value = [];

  const newsUrl = `https://newsapi.org/v2/top-headlines?page=1&pageSize=10&country=${selectedCountry}&apiKey=${
    import.meta.env.VITE_NEWS_API_KEY
  }`;
  await fetchNews(newsUrl);

  if (!newsArticles.value.length && countryDetails.value) {
    const fallbackNewsUrl = `https://newsapi.org/v2/everything?page=1&pageSize=10&searchIn=title&q=${encodeURIComponent(
      countryDetails.value.name.common
    )}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
    await fetchNews(fallbackNewsUrl);
  }
};

watch(
  () => countryDetailsData.value,
  (newData) => {
    if (newData && Array.isArray(newData)) {
      countryDetails.value = newData[0];
    }
  }
);

watch(
  () => newsData.value,
  (newData) => {
    if (newData) newsArticles.value = newData.articles;
  }
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
