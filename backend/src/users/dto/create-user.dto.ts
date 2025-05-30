import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  ArrayUnique,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum'; // Import Role enum

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional() // Roles are optional when creating
  @IsEnum(Role, { each: true }) // Each element in the array must be a valid Role enum value
  @ArrayUnique() // Ensure no duplicate roles
  roles?: Role[];
}
