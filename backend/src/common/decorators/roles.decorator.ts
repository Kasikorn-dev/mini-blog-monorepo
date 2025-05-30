// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum'; // Import Role enum

export const ROLES_KEY = 'roles'; // Key สำหรับเก็บ metadata
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
