import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleEntity } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { FollowEntity } from 'src/profiles/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
