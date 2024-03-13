import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './entities/users.entity';
import { Posts } from './entities/posts.entity';

const ENTITIES = [
  TypeOrmModule.forFeature([Users]),
  TypeOrmModule.forFeature([Posts]),
];

@Module({
  imports: ENTITIES,
  exports: ENTITIES,
})
export class EntitiesModule {}
