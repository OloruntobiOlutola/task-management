import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { createUserType, updateUserType } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
}
