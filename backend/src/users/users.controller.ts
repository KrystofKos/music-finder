import { Controller, Post, Body } from '@nestjs/common';
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

  @Post('avatar')
  async updateAvatar(@Body() body: any) {
    return this.usersService.updateAvatar({
      userId: String(body?.userId ?? ''),
      avatar:
        typeof body?.avatar === 'string'
          ? (body.avatar as string)
          : body?.avatar === null
            ? null
            : null,
    });
  }
}
