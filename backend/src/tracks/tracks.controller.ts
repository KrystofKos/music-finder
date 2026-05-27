import { Controller, Get, Query } from '@nestjs/common';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async searchQuery(@Query('query') query?: string) {
    if (!query?.trim()) return [];
    return this.tracksService.findOnDeezer(query);
  }

  // Backward-compatible: GET /tracks/search?name=...
  @Get('search')
  async search(@Query('name') name?: string) {
    if (!name?.trim()) return [];
    return this.tracksService.findOnDeezer(name);
  }
}
