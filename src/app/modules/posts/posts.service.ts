import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@modules/users/users.service';
import { Posts } from '@entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    private usersService: UsersService,
  ) {}

  async CreatePost(post: CreatePostDto) {
    const userFound = await this.usersService.getUser(post.authorId);

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPost = this.postsRepository.create(post);
    return this.postsRepository.save(newPost);
  }

  GetPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }
}
