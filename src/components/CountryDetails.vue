<template>
  <div class="bg-white rounded-lg">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">
      {{ country.name.common }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-semibold mb-2 text-gray-700">
          Basic Information
        </h3>
        <ul class="space-y-2 text-gray-600">
          <li>
            <strong>Official Name:</strong>
            {{ country.name.official }}
          </li>
          <li><strong>Region:</strong> {{ country.region }}</li>
          <li>
            <strong>Subregion:</strong>
            {{ country.subregion || "N/A" }}
          </li>
          <li>
            <strong>Population:</strong>
            {{ country.population.toLocaleString() }}
          </li>
          <li>
            <strong>Area:</strong>
            {{ country.area.toLocaleString() }} km²
          </li>
          <li>
            <strong>Capital:</strong>
            {{ country.capital?.[0] || "N/A" }}
          </li>
          <li>
            <strong>Continent:</strong>
            {{ country.continents?.join(", ") || "N/A" }}
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
            {{ Object.values(country.languages || {}).join(", ") || "N/A" }}
          </li>
          <li>
            <strong>Currencies:</strong>
            <span v-if="country.currencies">
              {{
                Object.entries(country.currencies)
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
            {{ country.tld?.join(", ") || "N/A" }}
          </li>
          <li>
            <strong>Timezones:</strong>
            {{ country.timezones?.join(", ") || "N/A" }}
          </li>
          <li>
            <strong>Independent:</strong>
            <span
              :class="country.independent ? 'text-green-600' : 'text-red-600'">
              {{ country.independent ? "Yes" : "No" }}
            </span>
          </li>
          <li>
            <strong>UN Member:</strong>
            <span :class="country.unMember ? 'text-green-600' : 'text-red-600'">
              {{ country.unMember ? "Yes" : "No" }}
            </span>
          </li>
          <li v-if="country.car?.side">
            <strong>Driving Side:</strong> {{ country.car.side }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Country } from "@/types";

defineProps({
  country: {
    type: Object as () => Country,
    required: true,
  },
});
</script>
