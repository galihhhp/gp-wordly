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
        class="block font-semibold mb-2 text-gray-700">
        Country:
      </label>
      <Select
        :options="countryOptions"
        placeholder="Select a country"
        @update:modelValue="
          async (value) => {
            isLoading = true;
            await handleCountrySelect(value as string);
            isLoading = false;
          }
        " />
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="loader"></div>
    </div>

    <template v-else>
      <div v-if="countryDetails" class="mb-8">
        <WeatherForecast
          :forecast="weatherForecast"
          :loading="false"
          :error="weatherError"
          :locationName="countryDetails.name.common" />
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <ErrorMessage
            v-if="countryDetailsError"
            :message="countryDetailsError" />
          <CountryDetails
            v-else-if="countryDetails"
            :country="countryDetails" />
        </div>

        <div class="w-full md:w-1/4">
          <ErrorMessage v-if="newsError" :message="newsError" />
          <NewsList
            v-else-if="newsArticles.length"
            :articles="newsArticles"
            :countryName="countryDetails?.name.common || ''" />
          <div
            v-else-if="countryDetails"
            class="bg-gray-100 p-4 rounded shadow-md">
            <p>No news articles found for {{ countryDetails.name.common }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useFetch } from "@/utils/useFetch";
import CountryDetails from "@/components/CountryDetails.vue";
import NewsList from "@/components/NewsList.vue";
import Select from "@/components/Select.vue";
import CountryMap from "@/components/CountryMap.vue";
import WeatherForecast from "@/components/WeatherForecast.vue";
import type { Country, NewsArticle } from "@/types";
import ErrorMessage from "@/components/ErrorMessage.vue";

const isLoading = ref<boolean>(false);

const countries = ref<Country[]>([]);
const selectedCountry = ref<string>("");
const countryDetails = ref<Country | null>(null);
const newsArticles = ref<NewsArticle[]>([]);
const lastNewsUrl = ref<string | null>(null);

const weatherForecast = ref<any>(null);
const weatherError = ref<string | null>(null);

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

watch(
  countriesLoading,
  (loading) => {
    if (loading) {
      isLoading.value = true;
    } else {
      isLoading.value = false;
    }
  },
  { immediate: true }
);

const countryOptions = computed(() =>
  countries.value.map((country) => ({
    value: country.cca3,
    label: country.name.common,
  }))
);

const fetchWeatherData = async (country: Country) => {
  if (!country.latlng || country.latlng.length < 2) {
    weatherError.value = "Location coordinates not available for this country";
    weatherForecast.value = null;
    return;
  }

  weatherError.value = null;

  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    let latitude = country.latlng[0];
    let longitude = country.latlng[1];

    if (country.capitalInfo?.latlng?.length === 2) {
      latitude = country.capitalInfo.latlng[0];
      longitude = country.capitalInfo.latlng[1];
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&start_date=${formatDate(
      today
    )}&end_date=${formatDate(sevenDaysLater)}`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    weatherForecast.value = data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherError.value = `Failed to fetch weather data: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    weatherForecast.value = null;
  }
};

const handleCountrySelect = async (countryCode: string) => {
  selectedCountry.value = countryCode;

  weatherForecast.value = null;
  weatherError.value = null;
  newsArticles.value = [];

  const countryUrl = `https://restcountries.com/v3.1/alpha/${selectedCountry.value}`;
  await fetchCountryDetails(countryUrl);

  if (countryDetailsData.value && Array.isArray(countryDetailsData.value)) {
    countryDetails.value = countryDetailsData.value[0];

    await fetchWeatherData(countryDetails.value as Country);

    const newsUrl = `https://newsapi.org/v2/top-headlines?page=1&pageSize=10&country=${
      selectedCountry.value
    }&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;

    lastNewsUrl.value = newsUrl;
    await fetchNews(newsUrl);

    if (!newsData.value?.articles.length) {
      const fallbackNewsUrl = `https://newsapi.org/v2/everything?page=1&pageSize=10&searchIn=title&q=${encodeURIComponent(
        countryDetails.value?.name.common || "country"
      )}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;

      lastNewsUrl.value = fallbackNewsUrl;
      await fetchNews(fallbackNewsUrl);
    }
  }
};

watch(
  () => countriesData.value,
  (newData) => {
    if (newData) countries.value = newData;
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
