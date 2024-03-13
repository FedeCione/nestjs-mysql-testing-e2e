import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'title',
    type: String,
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'content',
    type: String,
    required: true,
  })
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'authorId',
    type: Number,
    required: true,
  })
  authorId: number;
}
