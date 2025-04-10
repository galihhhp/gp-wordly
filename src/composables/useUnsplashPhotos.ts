import { ref } from "vue";
import { useFetch } from "@/utils/useFetch";
import type { Country } from "@/types";
import type { UnsplashPhoto } from "@/types/index";

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

export const useUnsplashPhotos = () => {
  const photos = ref<UnsplashPhoto[]>([]);
  const downloadedPhotos = ref<Set<string>>(new Set());

  const { loading, error, fetchData } = useFetch<UnsplashResponse | null>(null);

  const fetchCountryPhotos = async (country: Country) => {
    if (!country) return;

    photos.value = [];
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!apiKey) {
      throw new Error(
        "Unsplash API key not found. Please add VITE_UNSPLASH_ACCESS_KEY to your .env file."
      );
    }

    const searchStrategies = [
      `${country.name.common} landmarks scenic`,
      `${country.name.common} landscape nature`,
      `${country.name.common} tourism destination`,
      `${country.name.common} culture`,
      `${country.name.common} architecture`,
    ];

    if (country.capital?.length) {
      searchStrategies.push(`${country.capital[0]} landmarks`);
      searchStrategies.push(`${country.capital[0]} city`);
    }

    const shuffledStrategies = searchStrategies.sort(() => 0.5 - Math.random());
    const selectedStrategies = shuffledStrategies.slice(0, 4);
    const photoResults: UnsplashPhoto[] = [];

    for (const query of selectedStrategies) {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=15&orientation=landscape`;

      try {
        const response = await fetchData(url, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        });

        if (response && response.results?.length) {
          photoResults.push(...response.results);
        }
      } catch (err) {
        console.error(`Error fetching for query "${query}":`, err);
      }
    }

    if (photoResults.length) {
      const uniquePhotos = Array.from(
        new Map(photoResults.map((photo) => [photo.id, photo])).values()
      );

      photos.value = uniquePhotos.sort(() => 0.5 - Math.random()).slice(0, 30);
    } else {
      try {
        const fallbackUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          country.name.common
        )}&per_page=30`;

        const fallbackResponse = await fetchData(fallbackUrl, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        });

        if (fallbackResponse && fallbackResponse.results) {
          photos.value = fallbackResponse.results;
        }
      } catch (err) {
        console.error("Fallback search error:", err);
      }
    }

    return photos.value;
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

  return {
    photos,
    loading,
    error,
    fetchCountryPhotos,
    trackDownload,
  };
};
