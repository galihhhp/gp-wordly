<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
    <div class="max-w-4xl mx-auto">
      <h1
        class="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        World Explorer 🌍
      </h1>

      <div class="mb-6">
        <label
          for="country-select"
          class="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
          Select a Country:
        </label>
        <select
          id="country-select"
          v-model="selectedCountry"
          @change="debouncedFetchCountryDetails"
          class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <option value="" disabled>Select a country</option>
          <option
            v-for="country in countries"
            :key="country.cca3"
            :value="country.name.common">
            {{ country.name.common }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <div
        v-else-if="error"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>{{ error }}</p>
      </div>

      <div
        v-else-if="countryDetails"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-40 bg-gray-200 dark:bg-gray-700">
          <img
            :src="countryDetails.flags.svg"
            :alt="
              countryDetails.flags.alt ||
              `Flag of ${countryDetails.name.common}`
            "
            class="w-full h-full object-cover" />
          <div
            class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 class="text-3xl font-bold text-white">
              {{ countryDetails.name.common }}
              <span class="text-xl ml-2">({{ countryDetails.cca3 }})</span>
            </h2>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3
                class="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2">
                Basic Information
              </h3>

              <div class="space-y-2">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Official Name:</span>
                  {{ countryDetails.name.official }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Region:</span>
                  {{ countryDetails.region }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Subregion:</span>
                  {{ countryDetails.subregion || "N/A" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Population:</span>
                  {{ countryDetails.population.toLocaleString() }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Area:</span>
                  {{ countryDetails.area.toLocaleString() }} km²
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Capital:</span>
                  {{ countryDetails.capital?.[0] || "N/A" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Continent:</span>
                  {{ countryDetails.continents?.join(", ") || "N/A" }}
                </p>
              </div>
            </div>

            <div>
              <h3
                class="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2">
                Additional Details
              </h3>

              <div class="space-y-2">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Languages:</span>
                  {{
                    Object.values(countryDetails.languages || {}).join(", ") ||
                    "N/A"
                  }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Currencies:</span>
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
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Top-Level Domain:</span>
                  {{ countryDetails.tld?.join(", ") || "N/A" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Timezones:</span>
                  {{ countryDetails.timezones?.join(", ") || "N/A" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Independent:</span>
                  <span
                    :class="
                      countryDetails.independent
                        ? 'text-green-600'
                        : 'text-red-600'
                    ">
                    {{ countryDetails.independent ? "Yes" : "No" }}
                  </span>
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">UN Member:</span>
                  <span
                    :class="
                      countryDetails.unMember
                        ? 'text-green-600'
                        : 'text-red-600'
                    ">
                    {{ countryDetails.unMember ? "Yes" : "No" }}
                  </span>
                </p>
                <p
                  v-if="countryDetails.car?.side"
                  class="text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Driving Side:</span>
                  {{ countryDetails.car.side }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h3
              class="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2">
              Maps & Borders
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="mb-2 text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Maps:</span>
                </p>
                <div class="space-y-2">
                  <a
                    v-if="countryDetails.maps?.googleMaps"
                    :href="countryDetails.maps.googleMaps"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    View on Google Maps
                  </a>
                  <a
                    v-if="countryDetails.maps?.openStreetMaps"
                    :href="countryDetails.maps.openStreetMaps"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-block ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    View on OpenStreetMap
                  </a>
                </div>
              </div>

              <div>
                <p class="mb-2 text-gray-700 dark:text-gray-300">
                  <span class="font-medium">Bordering Countries:</span>
                </p>
                <div
                  v-if="
                    countryDetails.borders && countryDetails.borders.length > 0
                  "
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="border in countryDetails.borders"
                    :key="border"
                    class="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    {{ border }}
                  </span>
                </div>
                <p v-else class="text-gray-500 dark:text-gray-400">
                  No bordering countries (island nation or territory)
                </p>
              </div>
            </div>
          </div>

          <div v-if="countryDetails.coatOfArms?.svg" class="mt-8">
            <h3
              class="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2">
              Coat of Arms
            </h3>
            <div class="flex justify-center">
              <img
                :src="countryDetails.coatOfArms.svg"
                :alt="`Coat of Arms of ${countryDetails.name.common}`"
                class="h-48 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca3: string;
  region: string;
  subregion: string;
  population: number;
  capital?: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  flags: { svg: string; png: string; alt?: string };
  borders?: string[];
  area: number;
  timezones: string[];
  continents: string[];
  coatOfArms?: { svg: string; png: string };
  maps: { googleMaps: string; openStreetMaps: string };
  independent: boolean;
  unMember: boolean;
  car?: { side: string; signs: string[] };
  tld?: string[];
}

const countries = ref<Country[]>([]);
const selectedCountry = ref<string>("");
const countryDetails = ref<Country | null>(null);
const loading = ref<boolean>(false);
const error = ref<string>("");

const fetchCountries = async (): Promise<void> => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid response format");
    countries.value = data as Country[];
  } catch (err) {
    error.value = (err as Error).message;
  }
};

const fetchCountryDetails = async (): Promise<void> => {
  if (!selectedCountry.value) return;
  loading.value = true;
  error.value = "";
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        selectedCountry.value
      )}`
    );
    if (!response.ok) throw new Error("Failed to fetch country details");
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("Country not found");
    countryDetails.value = data[0] as Country;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
};

const debouncedFetchCountryDetails = debounce(fetchCountryDetails, 300);

onMounted(fetchCountries);
</script>
