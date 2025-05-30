// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service'; // Import UsersService

// Define the JWT Payload interface
export interface JwtPayload {
  username: string;
  sub: string; // User ID
  roles: string[]; // User Roles
  iat?: number; // Issued at
  exp?: number; // Expiration
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // 'jwt' is the strategy name
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, // Inject UsersService
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByUsername(payload.username); // ตรวจสอบว่าผู้ใช้ยังอยู่ในระบบหรือไม่
    if (!user || (user as any)._id.toString() !== payload.sub) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
    // Return the user object (or specific parts of it)
    // This object will be attached to req.user
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
