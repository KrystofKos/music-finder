import { Controller, Get, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('search')
  async search(@Query('name') name: string) {
    return this.artistsService.findOnSpotify(name);
  }
}