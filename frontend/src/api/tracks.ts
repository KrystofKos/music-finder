import { apiFetch } from "./http";

export interface Track {
  id: number;
  title: string;
  link: string;
  preview: string;
  duration: number;
  artist: null | {
    id: number;
    name: string;
    link: string;
    picture: string;
  };
  album: null | {
    id: number;
    title: string;
    cover: string;
  };
}

export const getTracks = async (query: string, signal?: AbortSignal) => {
  const data = await apiFetch<unknown>(
    `/tracks?query=${encodeURIComponent(query)}`,
    { signal },
  );
  return Array.isArray(data) ? (data as Track[]) : [];
};
