import { ArticleEntity } from '../article.entity';

export interface IArticleResponse {
  article: ArticleEntity;
}

export interface IArticlesResponse {
  articles: ArticleEntity[];
  total: number;
}
