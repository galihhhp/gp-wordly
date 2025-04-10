<template>
  <div class="bg-white rounded-xl border-2 p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">
      {{ country.name.common }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CountryInfoSection title="Basic Information">
        <CountryInfoItem label="Official Name" :value="country.name.official" />
        <CountryInfoItem label="Region" :value="country.region" />
        <CountryInfoItem label="Subregion" :value="country.subregion" />
        <CountryInfoItem
          label="Population"
          :value="country.population.toLocaleString()" />
        <CountryInfoItem
          label="Area"
          :value="`${country.area.toLocaleString()} km²`" />
        <CountryInfoItem label="Capital" :value="country.capital?.[0]" />
        <CountryInfoItem
          label="Continent"
          :value="country.continents?.join(', ')" />
      </CountryInfoSection>

      <CountryInfoSection title="Additional Details">
        <CountryInfoItem label="Languages">
          {{ Object.values(country.languages || {}).join(", ") || "N/A" }}
        </CountryInfoItem>

        <CountryInfoItem label="Currencies">
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
        </CountryInfoItem>

        <CountryInfoItem
          label="Top-Level Domain"
          :value="country.tld?.join(', ')" />
        <CountryInfoItem
          label="Timezones"
          :value="country.timezones?.join(', ')" />

        <CountryInfoItem label="Independent">
          <span
            :class="country.independent ? 'text-green-600' : 'text-red-600'">
            {{ country.independent ? "Yes" : "No" }}
          </span>
        </CountryInfoItem>

        <CountryInfoItem label="UN Member">
          <span :class="country.unMember ? 'text-green-600' : 'text-red-600'">
            {{ country.unMember ? "Yes" : "No" }}
          </span>
        </CountryInfoItem>

        <CountryInfoItem
          v-if="country.car?.side"
          label="Driving Side"
          :value="country.car.side" />
      </CountryInfoSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Country } from "@/types";
import CountryInfoSection from "./CountryInfoSection.vue";
import CountryInfoItem from "./CountryInfoItem.vue";

defineProps<{
  country: Country;
}>();
</script>
