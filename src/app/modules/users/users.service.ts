import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import { UpdateUserDto } from './users.dto';
import { CreateProfileDto } from './users.dto';
import { Users } from '@entities/users.entity';
import { Profiles } from '@entities/profiles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Profiles) private profileRepository: Repository<Profiles>,
  ) {}

  getUsers() {
    return this.userRepository.find({
      relations: ['posts', 'profile'],
    });
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts', 'profile'],
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (userFound) {
      return new HttpException('User already exist', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = Object.assign(userFound, user);
    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfile;

    return this.userRepository.save(userFound);
  }
}
