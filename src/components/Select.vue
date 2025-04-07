<template>
  <div class="relative" ref="selectWrapper">
    <div
      class="border-2 rounded-md p-2 bg-white text-gray-800 cursor-pointer flex justify-between items-center"
      @click="toggleDropdown"
      @keydown.escape="closeDropdown"
      tabindex="0">
      <span>{{ selectedOption?.label || placeholder }}</span>

      <svg
        class="w-4 h-4 text-black transition-transform duration-200"
        :class="{ 'transform rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-2 w-full bg-white border-2 rounded-md shadow-lg max-h-64 overflow-y-auto custom-scrollbar">
      <div class="p-2 border-b border-gray-200">
        <input
          ref="searchInput"
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0" />
      </div>

      <ul>
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="isOptionSelected(option) ? null : selectOption(option)"
          class="p-3 cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
          :class="{
            'font-semibold': isOptionSelected(option),
          }">
          <div class="flex items-center justify-between">
            {{ option.label }}
            <svg
              v-if="isOptionSelected(option)"
              class="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </li>
        <li
          v-if="filteredOptions.length === 0"
          class="p-3 text-gray-500 text-center">
          No results found
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

interface Option {
  value: string | number;
  label: string;
}

const props = defineProps({
  options: {
    type: Array as () => Option[],
    required: true,
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

const isOpen = ref(false);
const searchQuery = ref("");
const selectedOption = ref<Option | null>(null);
const selectWrapper = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

const filteredOptions = computed(() =>
  props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const isOptionSelected = (option: Option): boolean => {
  return selectedOption.value?.value === option.value;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectOption = (option: Option) => {
  if (!isOptionSelected(option)) {
    selectedOption.value = option;
    closeDropdown();
    searchQuery.value = "";
    emit("update:modelValue", option.value);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    selectWrapper.value &&
    !selectWrapper.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.custom-scrollbar {
  /* For Webkit browsers like Chrome/Safari */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}
</style>
