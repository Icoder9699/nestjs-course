import { Controller, Get, Post } from "@nestjs/common";
import { ArticleEntity } from "./article.entity";
import { ArticleService } from "./article.service";

@Controller("articles")
export class ArticleController{
  constructor(private readonly articleService: ArticleService){}

  @Get()
  get(){
    return "articles"
  }

  @Post()
  create(){
    return this.articleService.create()
  }
}