import { ref } from "vue";

export const useFetch = <T>(initialUrl: string | null) => {
  const data = ref<T | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchData = async (url: string, options?: RequestInit) => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      data.value = jsonData;
      return jsonData;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  if (initialUrl) {
    fetchData(initialUrl);
  }

  return { data, loading, error, fetchData };
};
