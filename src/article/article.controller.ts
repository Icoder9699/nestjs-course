import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateArticleDto } from './dto/createArticle.dto';
import { User } from 'src/users/decorators/user.decorator';
import { IArticleResponse } from './types/articleResponse.interface';
import { UserEntity } from 'src/users/user.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  get() {
    return 'articles';
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async findSingleArticleBySlug(@Param('slug') slug: string) {
    return await this.articleService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() user,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.create(user, createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User() user: UserEntity, @Param('slug') slug: string) {
    return this.articleService.deleteBySlug(user.id, slug);
  }
}
