<template>
  <div class="bg-white rounded-xl border-2 p-4 my-4 overflow-hidden">
    <h2 class="text-xl font-bold mb-6 flex items-center justify-between">
      <span>Explore {{ countryName }}</span>
      <div v-if="isLoading" class="loader"></div>
    </h2>

    <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-md mb-4">
      {{ error }}
    </div>

    <div v-if="isLoading && !photos.length" class="py-8 flex justify-center">
      <div>Finding breathtaking views of {{ countryName }}...</div>
    </div>

    <div
      v-if="!isLoading && photos.length === 0 && !error"
      class="text-center py-6 text-gray-500">
      No photos found for {{ countryName }}. Try another country!
    </div>

    <div v-if="photos.length > 0" class="photo-magazine">
      <div
        v-if="photos[0]"
        class="featured-photo mb-4 relative overflow-hidden shadow-xl rounded-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        @click="openLightbox(photos[0])">
        <img
          :src="photos[0].urls.regular"
          :alt="photos[0].alt_description || `Featured photo of ${countryName}`"
          class="w-full h-80 object-cover"
          @load="() => trackDownload(photos[0].id)"
          loading="lazy" />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
          <div class="text-xl font-bold leading-snug">
            {{
              photos[0].description ||
              photos[0].alt_description ||
              `Experience ${countryName}`
            }}
          </div>
          <a
            :href="
              photos[0].user.links.html +
              '?utm_source=gp-worldly&utm_medium=referral'
            "
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm hover:underline mt-2 opacity-90"
            @click.stop>
            Photo by {{ photos[0].user.name }} on Unsplash
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="(photo, index) in photos.slice(1)"
          :key="photo.id"
          class="photo-card relative overflow-hidden cursor-pointer rounded-lg shadow-md transform transition-all duration-300"
          :class="getPhotoClasses(index)"
          @click="openLightbox(photo)">
          <img
            :src="photo.urls.small"
            :alt="photo.alt_description || `Photo of ${countryName}`"
            class="w-full h-full object-cover transition-all duration-700 hover:scale-110"
            @load="() => trackDownload(photo.id)"
            loading="lazy" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
            <div class="text-sm font-medium">
              {{
                photo.description || photo.alt_description || "Discover more"
              }}
            </div>
            <a
              :href="
                photo.user.links.html +
                '?utm_source=gp-worldly&utm_medium=referral'
              "
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs hover:underline mt-1 opacity-90"
              @click.stop>
              Photo by {{ photo.user.name }} on Unsplash
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedPhoto"
      class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      @click="closeLightbox">
      <button
        class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
        @click.stop="closeLightbox"
        aria-label="Close image">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        v-if="currentPhotoIndex > 0"
        @click.stop="navigatePhoto(-1)"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="currentPhotoIndex < photos.length - 1"
        @click.stop="navigatePhoto(1)"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div class="relative max-w-7xl max-h-[85vh] animate-fadeIn">
        <img
          :src="selectedPhoto.urls.full"
          :alt="selectedPhoto.alt_description || `Photo of ${countryName}`"
          class="max-w-full max-h-[85vh] object-contain rounded-lg" />
      </div>

      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6 px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-xl font-bold text-white mb-2">
            {{
              selectedPhoto.description ||
              selectedPhoto.alt_description ||
              `Beautiful view from ${countryName}`
            }}
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <img
                v-if="selectedPhoto.user.profile_image?.small"
                :src="selectedPhoto.user.profile_image.small"
                :alt="selectedPhoto.user.name"
                class="w-10 h-10 rounded-full mr-3 border-2 border-white/20" />
              <div>
                <a
                  :href="
                    selectedPhoto.user.links.html +
                    '?utm_source=gp-worldly&utm_medium=referral'
                  "
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-white hover:underline block"
                  @click.stop>
                  {{ selectedPhoto.user.name }}
                </a>
                <a
                  href="https://unsplash.com/?utm_source=gp-worldly&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 text-sm hover:underline"
                  @click.stop>
                  View on Unsplash
                </a>
              </div>
            </div>
            <a
              :href="
                selectedPhoto.links.download +
                '?utm_source=gp-worldly&utm_medium=referral'
              "
              class="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { Country } from "@/types";

interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  user: {
    id: string;
    name: string;
    username: string;
    bio?: string;
    profile_image?: {
      small: string;
      medium: string;
      large: string;
    };
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
    };
  };
}

const props = defineProps<{
  country: Country | null;
}>();

const photos = ref<UnsplashPhoto[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedPhoto = ref<UnsplashPhoto | null>(null);
const currentPhotoIndex = ref<number>(0);
const countryName = computed(() => props.country?.name.common || "");
const downloadedPhotos = ref<Set<string>>(new Set());

const fetchPhotos = async () => {
  if (!props.country) return;

  isLoading.value = true;
  error.value = null;
  photos.value = [];

  try {
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!apiKey) {
      throw new Error(
        "Unsplash API key not found. Please add VITE_UNSPLASH_ACCESS_KEY to your .env file."
      );
    }

    const searchStrategies = [
      `${props.country.name.common} landmarks scenic`,
      `${props.country.name.common} landscape nature`,
      `${props.country.name.common} tourism destination`,
      `${props.country.name.common} culture`,
      `${props.country.name.common} architecture`,
      `${props.country.name.common} food`,
      `${props.country.name.common} history`,
    ];

    if (props.country.capital?.length) {
      searchStrategies.push(`${props.country.capital[0]} landmarks`);
      searchStrategies.push(`${props.country.capital[0]} city`);
      searchStrategies.push(`${props.country.capital[0]} streets`);
    }

    const shuffledStrategies = searchStrategies.sort(() => 0.5 - Math.random());
    const selectedStrategies = shuffledStrategies.slice(0, 4);
    const photoResults: UnsplashPhoto[] = [];

    for (const query of selectedStrategies) {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=15&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unsplash API error (${response.status}): ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.results?.length) {
        photoResults.push(...data.results);
      }
    }

    if (photoResults.length) {
      const uniquePhotos = Array.from(
        new Map(photoResults.map((photo) => [photo.id, photo])).values()
      );

      photos.value = uniquePhotos.sort(() => 0.5 - Math.random()).slice(0, 30);
    } else {
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          props.country.name.common
        )}&per_page=30`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!fallbackResponse.ok) {
        throw new Error(
          `Error in fallback photo search: ${fallbackResponse.statusText}`
        );
      }

      const fallbackData = await fallbackResponse.json();
      photos.value = fallbackData.results || [];
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to fetch photos";
  } finally {
    isLoading.value = false;
  }
};

const trackDownload = async (photoId: string) => {
  if (downloadedPhotos.value.has(photoId)) return;

  try {
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!apiKey) return;

    const response = await fetch(
      `https://api.unsplash.com/photos/${photoId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
      }
    );

    if (response.ok) {
      downloadedPhotos.value.add(photoId);
    }
  } catch (error) {}
};

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
      fetchPhotos();
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

const getPhotoClasses = (index: number) => {
  const classes = [
    "row-span-2 col-span-2",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-2 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
  ];
  return classes[index % classes.length];
};
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

.photo-magazine {
  display: grid;
  grid-template-rows: auto;
  gap: 1rem;
}

.featured-photo {
  grid-row: span 2;
}

.photo-card {
  transition: transform 0.3s ease-in-out;
}

.photo-card:hover {
  transform: scale(1.05);
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
