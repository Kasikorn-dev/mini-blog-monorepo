import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum'; // Import Role enum

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    // Default role to 'user' if not provided
    if (!createUserDto.roles || createUserDto.roles.length === 0) {
      createUserDto.roles = [Role.User];
    }

    const newUser = await this.usersService.create(createUserDto);
    // You might want to return a token directly after registration, or just a success message
    const payload = {
      username: newUser.username,
      sub: (newUser as any)._id,
      roles: newUser.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: (newUser as any)._id,
        username: newUser.username,
        roles: newUser.roles,
      },
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user; // Remove password from the returned object
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    // If validateUser throws, it means login failed
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload), // สร้าง JWT Token
      user: {
        _id: user._id,
        username: user.username,
        roles: user.roles,
      },
    };
  }
}
