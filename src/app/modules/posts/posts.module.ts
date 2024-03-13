import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '@entities/posts.entity';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
