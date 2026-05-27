import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('playlists')
  getPlaylists() {
    return this.dashboardService.getPlaylists();
  }

  @Get('top-tracks')
  async getTopTracks(
    @Query('limit') limit?: string,
    @Query('index') index?: string,
  ) {
    const n = limit ? Number(limit) : 3;
    const i = index ? Number(index) : 0;
    return this.dashboardService.getTopTracks(
      Number.isFinite(n) ? n : 3,
      Number.isFinite(i) ? i : 0,
    );
  }

  @Get('playlists/:id/tracks')
  async getPlaylistTracks(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
    @Query('index') index?: string,
  ) {
    const n = limit ? Number(limit) : 10;
    const i = index ? Number(index) : 0;
    return this.dashboardService.getPlaylistTracks(
      id,
      Number.isFinite(n) ? n : 10,
      Number.isFinite(i) ? i : 0,
    );
  }
}
