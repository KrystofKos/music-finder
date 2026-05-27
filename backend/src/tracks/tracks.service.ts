import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TracksService {
  async findOnDeezer(query: string) {
    const response = await axios.get(
      `https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=10`,
    );

    const tracks = response.data.data ?? [];

    return tracks.map((track) => ({
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
    }));
  }
}
