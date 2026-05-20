import { Controller, Get, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  // Frontend expects: GET /artists?query=...
  @Get()
  async searchQuery(@Query('query') query?: string) {
    if (!query?.trim()) return [];
    return this.artistsService.findOnSpotify(query);
  }

  // Backward-compatible: GET /artists/search?name=...
  @Get('search')
  async search(@Query('name') name?: string) {
    if (!name?.trim()) return [];
    return this.artistsService.findOnSpotify(name);
  }
}
