export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  region: string;
  subregion: string;
  population: number;
  capital?: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  area: number;
  timezones: string[];
  continents: string[];
  independent: boolean;
  unMember: boolean;
  car?: { side: string };
  tld?: string[];
  latlng: number[];
  flags?: {
    png: string;
    svg: string;
  };
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
}