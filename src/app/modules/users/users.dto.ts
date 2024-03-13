import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'firstname',
    type: String,
    required: true,
  })
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'lastname',
    type: String,
    required: true,
  })
  lastname: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'age',
    type: Number,
    required: false,
  })
  age?: number;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'username',
    type: String,
    required: true,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    type: String,
    required: true,
  })
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @ApiProperty({
    name: 'username',
    type: String,
    required: false,
  })
  username?: string;

  @IsString()
  @ApiProperty({
    name: 'password',
    type: String,
    required: false,
  })
  password?: string;
}
