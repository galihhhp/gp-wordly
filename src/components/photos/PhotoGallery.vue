<template>
  <div class="bg-white rounded-xl border-2 p-4 my-4 overflow-hidden">
    <h2 class="text-xl font-bold mb-6 flex items-center justify-between">
      <h3 class="text-2xl font-bold text-gray-800">
        Explore {{ countryName }}
      </h3>
      <div v-if="loading" class="loader"></div>
    </h2>

    <ErrorMessage v-if="error" :message="error" />

    <div v-if="loading && !photos.length" class="py-8 flex justify-center">
      <div>Framing the perfect views of {{ countryName }}...</div>
    </div>

    <div
      v-if="!loading && photos.length === 0 && !error"
      class="text-center py-6 text-gray-500">
      No photos found for {{ countryName }}. Try another country!
    </div>

    <PhotoGrid
      :photos="photos"
      :location-name="countryName"
      @select-photo="openLightbox"
      @track-download="trackDownload" />

    <PhotoViewer
      :photo="selectedPhoto"
      :location-name="countryName"
      :has-previous="currentPhotoIndex > 0"
      :has-next="currentPhotoIndex < photos.length - 1"
      @close="closeLightbox"
      @navigate="navigatePhoto" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { Country } from "@/types";
import { useUnsplashPhotos } from "@/composables/useUnsplashPhotos";
import PhotoGrid from "@/components/photos/PhotoGrid.vue";
import PhotoViewer from "@/components/photos/PhotoViewer.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import type { UnsplashPhoto } from "@/types/index";

const props = defineProps<{
  country: Country | null;
}>();

const selectedPhoto = ref<UnsplashPhoto | null>(null);
const currentPhotoIndex = ref<number>(0);
const countryName = computed(() => props.country?.name.common || "");

const { photos, loading, error, fetchCountryPhotos, trackDownload } =
  useUnsplashPhotos();

const openLightbox = (photo: UnsplashPhoto) => {
  selectedPhoto.value = photo;
  currentPhotoIndex.value = photos.value.findIndex((p) => p.id === photo.id);
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  selectedPhoto.value = null;
  currentPhotoIndex.value = 0;
  document.body.style.overflow = "";
};

const navigatePhoto = (direction: number) => {
  const newIndex = currentPhotoIndex.value + direction;
  if (newIndex >= 0 && newIndex < photos.value.length) {
    currentPhotoIndex.value = newIndex;
    selectedPhoto.value = photos.value[newIndex];
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!selectedPhoto.value) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    navigatePhoto(-1);
  } else if (e.key === "ArrowRight") {
    navigatePhoto(1);
  }
};

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry) {
      fetchCountryPhotos(newCountry);
    }
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
});
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
