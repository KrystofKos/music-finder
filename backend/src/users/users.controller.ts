import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.usersService.login(body);
  }

  // Cesta pro přidání umělce: PUT /users/ID_UZIVATELE/artist
  @Put(':id/artist')
  async addArtist(@Param('id') id: string, @Body('artistId') artistId: string) {
    return this.usersService.addArtist(id, artistId);
  }

  // Cesta pro přidání tracku: PUT /users/ID_UZIVATELE/track
  @Put(':id/track')
  async addTrack(@Param('id') id: string, @Body('trackId') trackId: string) {
    return this.usersService.addTrack(id, trackId);
  }
}