import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@entities/users.entity';
import { Profiles } from '@entities/profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Profiles])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
