import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tags/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormconfig';
import { UserModule } from './users/user.module';
import AuthMiddleware from './middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
