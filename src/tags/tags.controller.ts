import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  @Get()
  findAll() {
    return ['a', 'b', 'c'];
  }
}
