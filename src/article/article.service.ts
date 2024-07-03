import { UserEntity } from 'src/users/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)

    if (!article.tagList) {
      article.tagList = []
    }

    article.slug = "slug"
    article.author = currentUser
    
    return await this.articleRepository.save(article)
  }
}