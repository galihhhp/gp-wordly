<template>
  <div
    v-if="photo"
    class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
    @click="$emit('close')">
    <button
      class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
      @click.stop="$emit('close')"
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
      v-if="hasPrevious"
      @click.stop="$emit('navigate', -1)"
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
      v-if="hasNext"
      @click.stop="$emit('navigate', 1)"
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
        :src="photo.urls.full"
        :alt="photo.alt_description || `Photo of ${locationName}`"
        class="max-w-full max-h-[85vh] object-contain rounded-lg" />
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-xl font-bold text-white mb-2">
          {{
            photo.description ||
            photo.alt_description ||
            `Beautiful view from ${locationName}`
          }}
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img
              v-if="photo.user.profile_image?.small"
              :src="photo.user.profile_image.small"
              :alt="photo.user.name"
              class="w-10 h-10 rounded-full mr-3 border-2 border-white/20" />
            <div>
              <a
                :href="
                  photo.user.links.html +
                  '?utm_source=gp-worldly&utm_medium=referral'
                "
                target="_blank"
                rel="noopener noreferrer"
                class="text-white hover:underline block"
                @click.stop>
                {{ photo.user.name }}
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
              photo.links.download +
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
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { UnsplashPhoto } from "@/composables/useUnsplashPhotos";

defineProps<{
  photo: UnsplashPhoto | null;
  locationName: string;
  hasPrevious: boolean;
  hasNext: boolean;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "navigate", direction: number): void;
}>();
</script>

<style scoped>
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
