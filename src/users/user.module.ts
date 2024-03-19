import { Module } from '@nestjs/common';
import { UserControlller } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserControlller],
  providers: [UserService],
})
export class UserModule {}
