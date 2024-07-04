import { UserEntity } from 'src/users/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Repository } from 'typeorm';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }

  generateSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async create(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.generateSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } });
    return this.buildArticleResponse(article);
  }
}
