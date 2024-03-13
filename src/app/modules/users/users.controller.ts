import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Users } from '@entities/users.entity';
import { CreateUserDto, UpdateUserDto, CreateProfileDto } from './users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ description: 'Get Users' })
  @ApiResponse({ status: 200, description: 'Users getted successfully' })
  @ApiResponse({ status: 404, description: 'Users not found' })
  getUsers(): Promise<Users[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get User by ID' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @ApiResponse({
    status: 200,
    description: 'User with ID # getted successfully',
  })
  @ApiResponse({ status: 404, description: 'User with ID # not found' })
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @Post()
  @ApiOperation({ description: 'Create User' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
  })
  @ApiResponse({ status: 304, description: 'User already exists' })
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  @ApiOperation({ description: 'Update User' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @ApiResponse({
    status: 200,
    description: 'User with ID # updated successfully',
  })
  @ApiResponse({ status: 404, description: 'User with ID # not found' })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete User by ID' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @ApiResponse({
    status: 200,
    description: 'User with ID # deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'User with ID # not found' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/profile')
  @ApiOperation({ description: 'Create Profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile created successfully',
  })
  @ApiResponse({ status: 304, description: 'Profile already exists' })
  createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfileDto,
  ) {
    return this.usersService.createProfile(id, profile);
  }
}
