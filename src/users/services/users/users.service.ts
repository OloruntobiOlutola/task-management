import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { UserPostDTO } from 'src/users/dtos/UserPost.dto';
import {
  createUserType,
  updateUserType,
  UserPostType,
  userProfileType,
} from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createUser(userDetails: createUserType) {
    const newUser = this.userRepository.create({
      ...userDetails,
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

  async getUser(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.profile', 'profile')
      .getOne();
    const output = {
      status: 'success',
      user,
    };
    return output;
  }

  async getUserPosts(id: string) {
    const userPosts = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.posts', 'posts')
      .getMany();
    const output = {
      status: 'success',
      userPosts,
    };
    return output;
  }

  async updateUser(id: string, updateDetails: updateUserType) {
    await this.userRepository.update({ id }, { ...updateDetails });
    const user = await this.userRepository.findBy({ id });
    const output = {
      status: 'success',
      user,
    };
    return output;
  }

  async deleteUser(id: string) {
    await this.userRepository.delete({ id });
  }

  async createProfile(id: string, profileDetails: userProfileType) {
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

  async createPost(id: string, userPostType: UserPostType) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.posts', 'posts')
      .getMany();
    if (!user)
      throw new HttpException(
        'User with the id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    const userPost = this.postRepository.create({ ...userPostType });
    const savedPost = await this.postRepository.save(userPost);

    if (!user[0].posts) {
      user[0].posts = [savedPost];
    } else {
      user[0].posts = [...user[0].posts, savedPost];
    }
    const user_posts = await this.userRepository.save(user);
    return user_posts;
  }
}
