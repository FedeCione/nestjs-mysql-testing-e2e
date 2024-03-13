import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import helmet from 'helmet';
import morgan from './configs/morgan.config';

import { MySQLClientModule } from './database/mysql-client.module';
import { UsersModule } from '@modules/users/users.module';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  imports: [
    /* Nest/Config Modules */
    ConfigModule.forRoot(),
    MySQLClientModule,
    /* API Modules */
    UsersModule,
    PostsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), morgan).forRoutes('*');
  }
}
