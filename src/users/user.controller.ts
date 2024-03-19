import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserControlller {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  createUser(@Body('user') createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
