<template>
  <div class="min-h-screen p-4 container mx-auto">
    <Banner />

    <ErrorMessage v-if="countriesError" :message="countriesError" />

    <ErrorMessage v-if="countryDetailsError" :message="countryDetailsError" />

    <CountryMap v-if="countryDetails" :country="countryDetails" class="mb-8" />

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

    <template v-else-if="countryDetails">
      <div class="mb-8">
        <WeatherForecast
          :country="countryDetails"
          :locationName="countryDetails.name.common" />
      </div>

      <div class="mb-8">
        <LocalTimeDisplay :country="countryDetails" />
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <CountryDetails ref="countryDetailsRef" :country="countryDetails" />

          <div class="mb-8">
            <PhotoGallery :country="countryDetails" />
          </div>
        </div>

        <div class="w-full md:w-1/4">
          <NewsList
            :country="countryDetails"
            :countryName="countryDetails.name.common" />
        </div>
      </div>
    </template>

    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { useFetch } from "@/utils/useFetch";
import CountryDetails from "@/components/country/CountryDetails.vue";
import NewsList from "@/components/news/NewsList.vue";
import Select from "@/components/Select.vue";
import CountryMap from "@/components/CountryMap.vue";
import WeatherForecast from "@/components/weather/WeatherForecast.vue";
import LocalTimeDisplay from "@/components/LocalTimeDisplay.vue";
import PhotoGallery from "@/components/photos/PhotoGallery.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import type { Country } from "@/types";
import ErrorMessage from "@/components/ErrorMessage.vue";
import Banner from "@/components/Banner.vue";

const isLoading = ref<boolean>(false);
const countryDetailsRef = ref<InstanceType<typeof CountryDetails> | null>(null);

const countries = ref<Country[]>([]);
const selectedCountry = ref<string>("");
const countryDetails = ref<Country | null>(null);

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

watch(
  countriesLoading,
  (loading) => {
    isLoading.value = loading;
  },
  { immediate: true }
);

const countryOptions = computed(() =>
  countries.value.map((country) => ({
    value: country.cca3,
    label: country.name.common,
  }))
);

const scrollToCountryDetails = () => {
  nextTick(() => {
    setTimeout(() => {
      if (countryDetailsRef.value?.$el) {
        countryDetailsRef.value.$el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  });
};

const handleCountrySelect = async (countryCode: string) => {
  selectedCountry.value = countryCode;
  countryDetails.value = null;

  const countryUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;
  await fetchCountryDetails(countryUrl);

  if (countryDetailsData.value && Array.isArray(countryDetailsData.value)) {
    countryDetails.value = countryDetailsData.value[0];
    scrollToCountryDetails();
  }
};

watch(
  () => countriesData.value,
  (newData) => {
    if (newData) countries.value = newData;
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
