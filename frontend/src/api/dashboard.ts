import { apiFetch } from "./http";
import type { Track } from "./tracks";

export type DashboardPlaylist = {
  id: number;
  title: string;
};

export function getDashboardPlaylists(signal?: AbortSignal) {
  return apiFetch<DashboardPlaylist[]>("/dashboard/playlists", { signal });
}

export function getDashboardTopTracks(limit = 3, signal?: AbortSignal) {
  return apiFetch<Track[]>(`/dashboard/top-tracks?limit=${limit}`, { signal });
}

export function getDashboardPlaylistTracks(
  playlistId: number,
  limit = 10,
  signal?: AbortSignal,
) {
  return apiFetch<Track[]>(
    `/dashboard/playlists/${playlistId}/tracks?limit=${limit}`,
    { signal },
  );
}

export function getDashboardTopTracksPage(
  limit: number,
  index: number,
  signal?: AbortSignal,
) {
  return apiFetch<Track[]>(
    `/dashboard/top-tracks?limit=${limit}&index=${index}`,
    { signal },
  );
}

export function getDashboardPlaylistTracksPage(
  playlistId: number,
  limit: number,
  index: number,
  signal?: AbortSignal,
) {
  return apiFetch<Track[]>(
    `/dashboard/playlists/${playlistId}/tracks?limit=${limit}&index=${index}`,
    { signal },
  );
}
