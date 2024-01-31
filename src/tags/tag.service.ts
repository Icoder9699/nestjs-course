import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  findAll(): string[] {
    return ['a', 'b', 'c', 'd'];
  }
}
