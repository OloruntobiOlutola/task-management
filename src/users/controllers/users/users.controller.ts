import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import CreateUser from 'src/users/dtos/CreateUser.dto';
import { CreatedUser } from 'src/users/dtos/response.dto';
// import CreateUser from 'src/users/dtos/CreateUser.dto';
import updateUser from 'src/users/dtos/UpdateUser.dto';
import { UserPostDTO } from 'src/users/dtos/UserPost.dto';
import UserProfile from 'src/users/dtos/UserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUser): Promise<CreatedUser> {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: updateUser) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/profiles')
  createProfile(@Param('id') id: string, @Body() userProfileDto: UserProfile) {
    return this.usersService.createProfile(id, userProfileDto);
  }

  @Post(':id/posts')
  createPost(@Param('id') id: string, @Body() userPostDto: UserPostDTO) {
    return this.usersService.createPost(id, userPostDto);
  }

  @Get(':id/posts')
  getUserPosts(@Param('id') id: string) {
    return this.usersService.getUserPosts(id);
  }
}
