import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateArticleDto } from './dto/createArticle.dto';
import { User } from 'src/users/decorators/user.decorator';
import {
  IArticleResponse,
  IArticlesResponse,
} from './types/articleResponse.interface';
import { UserEntity } from 'src/users/user.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':slug')
  @UseGuards(AuthGuard)
  async findSingleArticleBySlug(@Param('slug') slug: string) {
    return this.articleService.buildArticleResponse(
      await this.articleService.findBySlug(slug),
    );
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

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async udpateArticle(
    @User() user: UserEntity,
    @Param('slug') slug: string,
    @Body('article') body: CreateArticleDto,
  ): Promise<IArticleResponse> {
    return this.articleService.buildArticleResponse(
      await this.articleService.updateBySlug(user.id, slug, body),
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getArticles(
    @User() user: UserEntity,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return this.articleService.getAll(user.id, query);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User() user: UserEntity,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.addArticleToFavorites(
      user.id,
      slug,
    );

    return this.articleService.buildArticleResponse(article);
  }
}
