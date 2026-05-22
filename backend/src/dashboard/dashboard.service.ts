import { Injectable } from '@nestjs/common';
import axios from 'axios';

type DashboardTrack = {
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
};

type Playlist = {
  id: number;
  title: string;
  query: string;
};

@Injectable()
export class DashboardService {
  private playlists: Playlist[] = [
    { id: 1, title: 'Cool Ass Playlist', query: 'Top hits' },
    { id: 2, title: 'Metal', query: 'Metal' },
    { id: 3, title: 'Country', query: 'Country' },
    { id: 4, title: 'Pop', query: 'Pop' },
    { id: 5, title: 'Rock', query: 'Rock' },
    { id: 6, title: 'Jazz', query: 'Jazz' },
    { id: 7, title: 'Hip Hop', query: 'Hip hop' },
    { id: 8, title: 'EDM', query: 'EDM' },
  ];

  getPlaylists() {
    return this.playlists.map(({ query, ...p }) => p);
  }

  private mapTrack(track: any): DashboardTrack {
    return {
      id: track.id,
      title: track.title,
      link: track.link,
      preview: track.preview,
      duration: track.duration,
      artist: track.artist
        ? {
            id: track.artist.id,
            name: track.artist.name,
            link: track.artist.link,
            picture: track.artist.picture_medium ?? track.artist.picture,
          }
        : null,
      album: track.album
        ? {
            id: track.album.id,
            title: track.album.title,
            cover: track.album.cover_medium ?? track.album.cover,
          }
        : null,
    };
  }

  async getTopTracks(limit = 3, index = 0) {
    const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
    const safeIndex = Math.max(0, Math.floor(index));
    const response = await axios.get(
      `https://api.deezer.com/chart/0/tracks?limit=${safeLimit}&index=${safeIndex}`,
    );
    const tracks = response.data?.data ?? [];
    return tracks.map((t: any) => this.mapTrack(t));
  }

  async getPlaylistTracks(id: number, limit = 10, index = 0) {
    const playlist = this.playlists.find((p) => p.id === id);
    if (!playlist) return [];

    const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
    const safeIndex = Math.max(0, Math.floor(index));
    const response = await axios.get(
      `https://api.deezer.com/search/track?q=${encodeURIComponent(
        playlist.query,
      )}&limit=${safeLimit}&index=${safeIndex}`,
    );

    const tracks = response.data?.data ?? [];
    return tracks.map((t: any) => this.mapTrack(t));
  }
}
