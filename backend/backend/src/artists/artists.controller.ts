import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  // 🔥 ONE SEARCH ENDPOINT (Spotify style)
  @Get()
  findAll(@Query('query') query?: string) {
    return this.artistsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }
}
