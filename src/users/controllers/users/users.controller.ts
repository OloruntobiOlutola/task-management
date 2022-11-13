import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import CreateUser from 'src/users/dtos/CreateUser.dto';
import updateUser from 'src/users/dtos/UpdateUser.dto';
import UserProfile from 'src/users/dtos/UserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUser) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: updateUser,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/profile')
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() userProfileDto: UserProfile,
  ) {
    return this.usersService.createProfile(id, userProfileDto);
  }
}
