import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { User } from "src/users/decorators/user.decorator";

@Controller("articles")
export class ArticleController{
  constructor(private readonly articleService: ArticleService){}

  @Get()
  get(){
    return "articles"
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  create(@User() user, @Body("article") createArticleDto: CreateArticleDto){
    return this.articleService.create(user, createArticleDto)
  }
} 