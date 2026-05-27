import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ArtistsService {
  async findOnSpotify(name: string) {
    // Hledáme umělce na Deezeru
    const response = await axios.get(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=5`,
    );

    const artists = response.data.data;

    return await Promise.all(
      artists.map(async (artist) => {
        // Stáhneme jen ten úplně nejlepší track (limit=1)
        const tracksResponse = await axios.get(
          `https://api.deezer.com/artist/${artist.id}/top?limit=1`,
        );

        const topTrack = tracksResponse.data.data[0];

        return {
          id: artist.id,
          name: artist.name,
          image: artist.picture_medium,
          popularity: artist.nb_fan,
          link: artist.link,
          bestTrack: topTrack
            ? {
                title: topTrack.title,
                preview: topTrack.preview,
              }
            : null,
        };
      }),
    );
  }
}
