import { Module } from '@nestjs/common';
import { UserControlller } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserControlller],
  providers: [UserService],
})
export class UserModule {}
