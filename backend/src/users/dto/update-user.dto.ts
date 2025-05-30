import { PartialType } from '@nestjs/mapped-types'; // ติดตั้ง npm install @nestjs/mapped-types
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  ArrayUnique,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string; // Allow password update, but hash it in service

  @IsOptional()
  @IsEnum(Role, { each: true })
  @ArrayUnique()
  roles?: Role[];
}
