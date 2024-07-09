import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { IProfileResponse } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  buildProfileResponse(profile: ProfileType): IProfileResponse {
    delete profile.email;
    return { profile };
  }
  async getProfile(
    currentUserId: number,
    profileUserName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUserName },
    });

    if (!user) {
      throw new HttpException('Profile does not exist!', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id }});
    
    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    profileUserName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUserName },
    });

    if (!user) {
      throw new HttpException('Profile does not exist!', HttpStatus.NOT_FOUND);
    }

    if (user.id === currentUserId) {
      throw new HttpException(
        'Follower and following cant be equal!',
        HttpStatus.BAD_REQUEST,
      );
    }

   
    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });

    
    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };

  }

  async unfollowProfile(
    currentUserId: number,
    profileUserName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUserName },
    });
    
    if (!user) {
      throw new HttpException('Profile does not exist!', HttpStatus.NOT_FOUND);
    }

    if (user.id === currentUserId) {
      throw new HttpException(
        'Follower and following cant be equal!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({ followerId: currentUserId, followingId: user.id});

    return { ...user, following: false };
  }
}
