import { apiFetch } from "./http";

export interface Artist {
  id: number;
  name: string;
  image: string;
  popularity: number;
  link: string;
  bestTrack: null | {
    title: string;
    preview: string;
  };
}

export const getArtists = async (query: string, signal?: AbortSignal) => {
  const data = await apiFetch<unknown>(
    `/artists?query=${encodeURIComponent(query)}`,
    { signal },
  );
  return Array.isArray(data) ? (data as Artist[]) : [];
};
