<template>
  <div class="min-h-screen p-4 container mx-auto">
    <div
      class="h-96 bg-red-400 text-white font-bold text-2xl rounded-2xl flex items-center justify-center mb-8">
      {{ countryDetails?.name.common }}
    </div>
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <label
          for="country-select"
          class="block text-lg font-medium mb-2 text-gray-700">
          Select a Country:
        </label>
        <select
          id="country-select"
          v-model="selectedCountry"
          class="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="" disabled>Select a country</option>
          <option
            v-for="country in countries"
            :key="country.cca3"
            :value="country.cca3">
            {{ country.name.common }}
          </option>
        </select>
      </div>

      <div
        v-if="countriesLoading || countryDetailsLoading || newsLoading"
        class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>

      <div
        v-else-if="countriesError || countryDetailsError || newsError"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
        <p>{{ countriesError || countryDetailsError || newsError }}</p>
      </div>

      <div
        v-else-if="countryDetails"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          {{ countryDetails.name.common }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-700">
              Basic Information
            </h3>
            <ul class="space-y-2 text-gray-600">
              <li>
                <strong>Official Name:</strong>
                {{ countryDetails.name.official }}
              </li>
              <li><strong>Region:</strong> {{ countryDetails.region }}</li>
              <li>
                <strong>Subregion:</strong>
                {{ countryDetails.subregion || "N/A" }}
              </li>
              <li>
                <strong>Population:</strong>
                {{ countryDetails.population.toLocaleString() }}
              </li>
              <li>
                <strong>Area:</strong>
                {{ countryDetails.area.toLocaleString() }} km²
              </li>
              <li>
                <strong>Capital:</strong>
                {{ countryDetails.capital?.[0] || "N/A" }}
              </li>
              <li>
                <strong>Continent:</strong>
                {{ countryDetails.continents?.join(", ") || "N/A" }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-700">
              Additional Details
            </h3>
            <ul class="space-y-2 text-gray-600">
              <li>
                <strong>Languages:</strong>
                {{
                  Object.values(countryDetails.languages || {}).join(", ") ||
                  "N/A"
                }}
              </li>
              <li>
                <strong>Currencies:</strong>
                <span v-if="countryDetails.currencies">
                  {{
                    Object.entries(countryDetails.currencies)
                      .map(
                        ([code, currency]) =>
                          `${currency.name} (${currency.symbol || code})`
                      )
                      .join(", ")
                  }}
                </span>
                <span v-else>N/A</span>
              </li>
              <li>
                <strong>Top-Level Domain:</strong>
                {{ countryDetails.tld?.join(", ") || "N/A" }}
              </li>
              <li>
                <strong>Timezones:</strong>
                {{ countryDetails.timezones?.join(", ") || "N/A" }}
              </li>
              <li>
                <strong>Independent:</strong>
                <span
                  :class="
                    countryDetails.independent
                      ? 'text-green-600'
                      : 'text-red-600'
                  ">
                  {{ countryDetails.independent ? "Yes" : "No" }}
                </span>
              </li>
              <li>
                <strong>UN Member:</strong>
                <span
                  :class="
                    countryDetails.unMember ? 'text-green-600' : 'text-red-600'
                  ">
                  {{ countryDetails.unMember ? "Yes" : "No" }}
                </span>
              </li>
              <li v-if="countryDetails.car?.side">
                <strong>Driving Side:</strong> {{ countryDetails.car.side }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="newsArticles.length" class="mt-8">
        <h3 class="text-xl font-bold mb-4 text-gray-800">
          News About {{ countryDetails?.name.common }}
        </h3>
        <ul class="space-y-4">
          <li
            v-for="article in newsArticles.slice(0, 10)"
            :key="article.url"
            class="bg-gray-100 p-4 rounded shadow-md">
            <a
              :href="article.url"
              target="_blank"
              class="text-blue-600 font-semibold hover:underline">
              {{ article.title }}
            </a>
            <p class="text-gray-600 mt-2">{{ article.description }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useFetch } from "@/utils/useFetch";

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  region: string;
  subregion: string;
  population: number;
  capital?: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  area: number;
  timezones: string[];
  continents: string[];
  independent: boolean;
  unMember: boolean;
  car?: { side: string };
  tld?: string[];
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
}

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

watch(
  () => countriesData.value,
  (newData) => {
    if (newData) countries.value = newData;
  }
);

watch(
  () => selectedCountry.value,
  async (newCountry) => {
    if (newCountry) {
      const countryCode = newCountry.toLowerCase();
      const countryUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;
      fetchCountryDetails(countryUrl);

      const newsUrl = `https://newsapi.org/v2/top-headlines?page=1&pageSize=10&country=${countryCode}&apiKey=${
        import.meta.env.VITE_NEWS_API_KEY
      }`;
      await fetchNews(newsUrl);

      if (!newsArticles.value.length && countryDetails.value) {
        const fallbackNewsUrl = `https://newsapi.org/v2/everything?page=1&pageSize=10&searchIn=title&q=${encodeURIComponent(
          countryDetails.value.name.common
        )}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
        await fetchNews(fallbackNewsUrl);
      }
    }
  }
);

watch(
  () => countryDetailsData.value,
  (newData) => {
    if (newData && Array.isArray(newData)) countryDetails.value = newData[0];
  }
);

watch(
  () => newsData.value,
  (newData) => {
    if (newData) newsArticles.value = newData.articles;
  }
);
</script>
