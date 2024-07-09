import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserEntity } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
