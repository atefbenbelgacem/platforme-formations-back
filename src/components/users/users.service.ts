import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.schema';
import { USERS_MODEL_NAME } from 'src/shared/constants/constants';
import { CreateUserDto } from './createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USERS_MODEL_NAME) private readonly usersModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.usersModel(createUserDto);
    const result = await createdUser.save();
    return result;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersModel
      .find({}, '-password -__v')
      .populate({ path: 'pole', select: '-__v' })
      .exec();
    return users;
  }

  async findUserById(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.usersModel
        .findById(id, '-password -__v')
        .populate({ path: 'pole', select: '-__v' })
        .exec();
    } catch (error) {
      throw new NotFoundException('the id of your user is invalid');
    }
    if (!user) {
      throw new NotFoundException('could not find your user');
    }
    return user;
  }

  async findUsersByIds(usersIds: string[]): Promise<User[]> {
    let users: User[] = [];
    try {
      users = await this.usersModel
        .find({ _id: { $in: usersIds } }, '-password -__v')
        .populate({ path: 'pole', select: '-__v' })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'could not find the users by Ids array',
      );
    }
    return users;
  }

  async findUsersByPoleId(poleId: string): Promise<User[]> {
    let users: User[] = [];
    try {
      users = await this.usersModel
        .find({ pole: poleId }, '-password -__v')
        .populate({ path: 'pole', select: '-__v' })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'could not find the users by poleId',
      );
    }
    return users;
  }

  async findUserByEmail(email: string): Promise<User> {
    let user: User;
    try {
      user = await this.usersModel
        .findOne({ email: email })
        .populate({ path: 'pole', select: '-__v' })
        .exec();
    } catch (error) {
      throw new NotFoundException('the email of your user is invalid');
    }
    if (!user) {
      throw new NotFoundException('could not find your user');
    }
    return user;
  }

  async findUsersByEmails(emails: string[]): Promise<User[]> {
    let users: User[] = [];
    try {
      users = await this.usersModel
        .find({ email: { $in: emails } }, '-password -__v')
        .populate({ path: 'pole', select: '-__v' })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'could not find the users by Ids array',
      );
    }
    return users;
  }

  async elasticSearch(email: string): Promise<User[]> {
    let users: User[] = [];
    try {
      users = await this.usersModel
        .find({ email: { $regex: email } }, '-password -__v')
        .populate({ path: 'pole', select: '-__v' })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'could not find the users by Ids array',
      );
    }
    return users;
  }

  async updateUser(id: string, updateData: User): Promise<User> {
    const user = await this.findUserById(id);
    const updatedUser = user.set(updateData);
    const result = await user.save();
    return result;
  }

  async deleteUser(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.usersModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'could not delete the user, invalid Id provided',
      );
    }
    if (!user) {
      throw new NotFoundException(
        'could not delete the user, user does not exist',
      );
    }
    return user;
  }
}
