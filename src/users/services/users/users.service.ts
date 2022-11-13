import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import {
  createUserType,
  updateUserType,
  userProfileType,
} from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(userDetails: createUserType) {
    // throw new Error('Method not implemented.');
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    const user = await this.userRepository.save(newUser);

    const output = {
      status: 'success',
      user,
    };
    return output;
  }

  async getUsers() {
    const users = await this.userRepository.find();
    const output = {
      status: 'success',
      result: users.length,
      users,
    };
    return output;
  }

  async updateUser(id: number, updateDetails: updateUserType) {
    await this.userRepository.update({ id }, { ...updateDetails });
    const user = await this.userRepository.findBy({ id });
    const output = {
      status: 'success',
      user,
    };
    return output;
  }

  async deleteUser(id: number) {
    await this.userRepository.delete({ id });
  }

  async createProfile(id: number, profileDetails: userProfileType) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User with the id does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const userProfile = this.profileRepository.create({
      ...profileDetails,
    });

    const savedProfile = await this.profileRepository.save(userProfile);

    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
