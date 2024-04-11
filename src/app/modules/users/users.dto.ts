import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

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
