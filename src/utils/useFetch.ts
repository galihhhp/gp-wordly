import { ref, watchEffect } from "vue";

export const useFetch = <T>(
  initialUrl: string | null,
  options?: RequestInit
) => {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const abortController = new AbortController();

  const fetchData = async (url: string | null = initialUrl) => {
    if (!url) return;
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result: T = await response.json();
      data.value = result;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        error.value = (err as Error).message;
      }
    } finally {
      loading.value = false;
    }
  };

  watchEffect(() => {
    if (initialUrl) fetchData(initialUrl);
  });

  const abort = () => {
    abortController.abort();
  };

  return { data, loading, error, fetchData, abort };
};
