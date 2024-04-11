import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import { UpdateUserDto } from './users.dto';
import { Users } from '@entities/users.entity';
import { ErrorManager } from '@shared/utils/error.manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async getUsers() {
    try {
      const users = await this.userRepository.find({
        relations: ['posts'],
      });

      if (users.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User/s not found',
        });
      }

      return users;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['posts'],
      });

      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }

  async createUser(body: CreateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: body.email },
      });

      if (user) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'User already exist',
        });
      }

      const createdUser = this.userRepository.create(body);
      const savedUser = this.userRepository.save(createdUser);
      return savedUser;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const updatedUser = Object.assign(user, body);
      const savedUser = this.userRepository.save(updatedUser);
      return savedUser;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.delete({ id });

      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    } catch (error) {
      ErrorManager.createSignatureError(error.message);
    }
  }
}
