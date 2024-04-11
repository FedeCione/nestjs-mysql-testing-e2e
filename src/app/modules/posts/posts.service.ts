import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@modules/users/users.service';
import { Posts } from '@entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './posts.dto';
import { ErrorManager } from '@shared/utils/error.manager';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private usersService: UsersService,
  ) {}

  async getPosts() {
    try {
      const posts = await this.postsRepository.find();

      if (posts.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Post/s not found',
        });
      }

      return posts;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }

  async CreatePost(post: CreatePostDto) {
    try {
      const user = await this.usersService.getUser(post.authorId);

      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const createdPost = this.postsRepository.create(post);
      const savedPost = this.postsRepository.save(createdPost);
      return savedPost;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }
}
