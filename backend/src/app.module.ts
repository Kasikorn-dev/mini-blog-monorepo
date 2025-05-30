import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ทำให้ ConfigModule ใช้งานได้ทั่วทั้งแอป
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // ต้อง import ConfigModule ด้วย
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // ดึง URI จาก .env
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
