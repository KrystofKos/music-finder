import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ArtistsService {
  private clientId = 'a04eaa0d43034df49f2aa6684b742dc5'; 
  private clientSecret = '423f987d4ab74f21829d0033e9299e41';

  private async getAccessToken(): Promise<string> {
    const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: { 
        Authorization: `Basic ${authString}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    });
    return response.data.access_token;
  }

  async findOnSpotify(name: string) {
    const token = await this.getAccessToken();
    
    // Voláme přímo oficiální Spotify API - tady ty nuly nebudou
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=5`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.artists.items.map(artist => ({
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url || 'https://via.placeholder.com/150',
      genres: artist.genres || [],
      popularity: artist.popularity, // Teď už to bude reálné číslo 0-100
      followers: artist.followers?.total || 0, // Teď už to bude reálný počet
      spotifyUrl: artist.external_urls?.spotify
    }));
  }
}