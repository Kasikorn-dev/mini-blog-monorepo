import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ username: createUserDto.username })
      .exec();
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    // Password hashing happens in the pre-save hook on the schema
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec(); // ไม่ส่ง password กลับไปด้วย
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec(); // ส่ง password กลับมาด้วยเพื่อใช้ในการตรวจสอบการ login
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    return updatedUser;
  }

  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
