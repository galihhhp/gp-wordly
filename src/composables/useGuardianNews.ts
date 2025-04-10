import { computed } from "vue";
import { useFetch } from "@/utils/useFetch";
import type { GuardianArticle, GuardianResponse } from "@/types";

export const useGuardianNews = () => {
  const {
    data: newsData,
    loading,
    error,
    fetchData: fetchNews,
  } = useFetch<GuardianResponse | null>(null);

  const articles = computed<GuardianArticle[]>(
    () => newsData.value?.response?.results || []
  );

  const fetchArticles = (query: string) => {
    const guardianApiUrl = `https://content.guardianapis.com/search?q=${encodeURIComponent(
      query
    )}&page-size=10&show-fields=thumbnail,headline,trailText&api-key=${import.meta.env.VITE_GUARDIAN_API_KEY
      }`;

    return fetchNews(guardianApiUrl);
  };

  return {
    articles,
    loading,
    error,
    fetchArticles,
  };
};