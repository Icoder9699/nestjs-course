import { UserEntity } from 'src/users/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import {
  IArticleResponse,
  IArticlesResponse,
} from './types/articleResponse.interface';
import slugify from 'slugify';
import { FollowEntity } from 'src/profiles/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    private dataSoure: DataSource,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async deleteBySlug(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      new HttpException("Article doesn't exsists!", HttpStatus.NOT_FOUND);
    }

    if (currentUserId !== article?.author.id) {
      new HttpException('You are not an author!', HttpStatus.FORBIDDEN);
    }

    return this.articleRepository.delete({ slug });
  }

  async updateBySlug(
    currentUserId: number,
    slug: string,
    updatedArticle: CreateArticleDto,
  ) {
    const article = await this.findBySlug(slug);

    if (currentUserId !== article?.author.id) {
      new HttpException('You are not an author!', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updatedArticle);

    return await this.articleRepository.save(article);
  }

  async getAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
    const queryBuilder = this.dataSoure
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', query.filterBy || 'DESC');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', { id: author?.id });
    }

    // username that was liked
    if (query.favorited) {
      const user = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: { favorites: true },
      });
      const ids = user.favorites.map((fav) => fav.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let userFavIds: number[] = [];
    if (currentUserId) {
      const user = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });

      userFavIds = user.favorites.map((fav) => fav.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      // new field
      const favorited = userFavIds.includes(article.id);

      return { ...article, favorited };
    });
    const total = await queryBuilder.getCount();

    return { articles: articlesWithFavorites, total };
  }

  async getFeed(currentUserId: number, query: any) : Promise<IArticlesResponse> {
    const follows = await this.followRepository.find({ where: { followerId: currentUserId }})

    if (!follows){
      return { articles: [], total: 0 }
    }

    const followingUserIds = follows.map(follow => follow.followingId)
    const queryBuilder = this.dataSoure
    .getRepository(ArticleEntity)
    .createQueryBuilder('articles')
    .leftJoinAndSelect('articles.author', 'author')
    .where('articles.id IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy("articles.createdAt", 'DESC');

    if (query.limit) {
      queryBuilder.limit(query.limit)
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }
    
    const articles = await queryBuilder.getMany()
    return articles as any
  }

  async addArticleToFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: {
        favorites: true,
      },
    });

    const isFavorite = user.favorites.some(
      (favArticle) => favArticle.id === article.id,
    );

    if (isFavorite) {
      return article;
    }

    user.favorites.push(article);
    article.favoritesCount++;
    this.articleRepository.save(article);
    this.userRepository.save(user);

    return article;
  }

  async removeArticleFromFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: {
        favorites: true,
      },
    });

    const articleIndex = user.favorites.findIndex(
      (favArticle) => favArticle.id === article.id,
    );

    if (articleIndex < 0) {
      return article;
    }

    user.favorites.splice(articleIndex, 1);
    article.favoritesCount--;
    this.articleRepository.save(article);
    this.userRepository.save(user);

    return article;
  }
}
