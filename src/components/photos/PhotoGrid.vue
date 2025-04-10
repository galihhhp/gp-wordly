<template>
  <div v-if="photos.length > 0" class="photo-magazine">
    <div
      v-if="photos[0]"
      class="featured-photo mb-4 relative overflow-hidden shadow-xl rounded-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      @click="$emit('select-photo', photos[0])">
      <img
        :src="photos[0].urls.regular"
        :alt="photos[0].alt_description || `Featured photo of ${locationName}`"
        class="w-full h-80 object-cover"
        @load="() => $emit('track-download', photos[0].id)"
        loading="lazy" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
        <div class="text-xl font-bold leading-snug">
          {{
            photos[0].description ||
            photos[0].alt_description ||
            `Experience ${locationName}`
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
        @click="$emit('select-photo', photo)">
        <img
          :src="photo.urls.small"
          :alt="photo.alt_description || `Photo of ${locationName}`"
          class="w-full h-full object-cover transition-all duration-700 hover:scale-110"
          @load="() => $emit('track-download', photo.id)"
          loading="lazy" />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
          <div class="text-sm font-medium">
            {{ photo.description || photo.alt_description || "Discover more" }}
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
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { UnsplashPhoto } from "@/types/index";

defineProps<{
  photos: UnsplashPhoto[];
  locationName: string;
}>();

defineEmits<{
  (e: "select-photo", photo: UnsplashPhoto): void;
  (e: "track-download", photoId: string): void;
}>();

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
</style>
