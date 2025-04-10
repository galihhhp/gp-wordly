import { computed } from "vue";
import { useFetch } from "@/utils/useFetch";
import type { Country } from "@/types";

export interface WeatherForecast {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export const useWeatherForecast = () => {
  const {
    data: weatherData,
    loading,
    error,
    fetchData
  } = useFetch<WeatherForecast | null>(null);

  const forecast = computed(() => weatherData.value);

  const fetchForecast = (country: Country) => {
    const url = getWeatherUrl(country);
    if (!url) return null;
    return fetchData(url);
  };

  const getWeatherUrl = (country: Country): string | null => {
    if (!country.latlng || country.latlng.length < 2) {
      return null;
    }

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    let latitude = country.latlng[0];
    let longitude = country.latlng[1];

    if (country.capitalInfo?.latlng?.length === 2) {
      latitude = country.capitalInfo.latlng[0];
      longitude = country.capitalInfo.latlng[1];
    }

    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&start_date=${formatDate(
      today
    )}&end_date=${formatDate(sevenDaysLater)}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return {
    forecast,
    loading,
    error,
    fetchForecast,
    formatDate
  };
};