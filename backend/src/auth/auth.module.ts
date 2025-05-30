import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
  imports: [
    UsersModule, // จำเป็นต้อง import UsersModule เพื่อให้ AuthService ใช้ UsersService ได้
    PassportModule,
    ConfigModule, // Import ConfigModule here to use ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here again to ensure it's available for useFactory
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // Token หมดอายุใน 1 ชั่วโมง
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy ต้องถูกประกาศเป็น provider
  exports: [AuthService, JwtModule], // Export AuthService และ JwtModule หาก Module อื่นต้องการใช้
})
export class AuthModule {}
