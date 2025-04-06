<template>
  <div class="p-4 rounded mb-4 bg-red-50 text-red-700">
    <h3 class="font-medium mb-1">{{ getErrorTitle(props.message) }}</h3>
    <p>{{ getErrorDescription(props.message) }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string;
}>();

const getErrorTitle = (errorMessage: string) => {
  if (errorMessage.includes("429")) return "Rate Limit Exceeded";
  if (errorMessage.includes("connection") || errorMessage.includes("network"))
    return "Connection Problem";
  if (errorMessage.includes("not found") || errorMessage.includes("404"))
    return "Resource Not Found";

  return "Error Occurred";
};

const getErrorDescription = (errorMessage: string) => {
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes("429") ||
    lowerMessage.includes("too many requests")
  ) {
    return "The API is limiting requests. Please wait a moment before trying again.";
  }

  if (
    lowerMessage.includes("connection") ||
    lowerMessage.includes("network") ||
    lowerMessage.includes("cors")
  ) {
    return "There was a problem connecting to the server. Please check your internet connection.";
  }

  if (lowerMessage.includes("not found") || lowerMessage.includes("404")) {
    return "The requested resource could not be found. It may have been moved or deleted.";
  }

  return errorMessage;
};
</script>
