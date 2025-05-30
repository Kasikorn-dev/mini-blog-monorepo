import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Import CreateUserDto

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Return 200 OK
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
