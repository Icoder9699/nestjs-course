import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/users/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.getProfile(
      currentUserId,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Get(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.followProfile(
      currentUserId,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
