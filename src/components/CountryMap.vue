<template>
  <div class="bg-white rounded-lg">
    <div class="h-96 w-full rounded-lg overflow-hidden">
      <l-map
        ref="mapRef"
        v-model:zoom="zoom"
        :center="mapCenter"
        :use-global-leaflet="false"
        class="h-full w-full">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"></l-tile-layer>
        <l-marker :lat-lng="mapCenter">
          <l-popup>
            <div class="text-center">
              <div class="font-bold">{{ country.name.common }}</div>
              <div class="text-sm text-gray-600">{{ country.region }}</div>
              <div class="mt-2">
                <img
                  v-if="country.flags?.png"
                  :src="country.flags.png"
                  :alt="`Flag of ${country.name.common}`"
                  class="h-10 inline-block" />
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import type { Country } from "@/types";

interface Props {
  country: Country;
}

const props = defineProps<Props>();

const mapRef = ref(null);
const zoom = ref(5);

const mapCenter = computed(() => {
  if (props.country?.latlng && props.country.latlng.length === 2) {
    return [props.country.latlng[0], props.country.latlng[1]];
  }
  return [0, 0];
});

onMounted(() => {
  // @ts-ignore
  const L = window.L;
  if (L) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }
});
</script>
