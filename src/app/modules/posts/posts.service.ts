import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@modules/users/users.service';
import { Posts } from '@entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private usersService: UsersService,
  ) {}

  async getPosts() {
    const response = await this.postsRepository.find({
      relations: ['author'],
    });

    if(response.length <= 0) {
      return {
        status: 404,
        data: {
          message: "Post/s not found"
        }
      }
    }

    return {
      status: 200,
      data: {
        posts: response
      }
    };
  }

  async CreatePost(post: CreatePostDto) {
    const userFound = await this.usersService.getUser(post.authorId);

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPost = this.postsRepository.create(post);
    return this.postsRepository.save(newPost);
  }
}
