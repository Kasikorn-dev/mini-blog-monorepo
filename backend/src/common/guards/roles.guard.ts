// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Import Reflector
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator'; // Import ROLES_KEY

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Inject Reflector

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึง Roles ที่ต้องการจาก Metadata ของ Route/Controller
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // สำหรับ method-level decorators
      context.getClass(), // สำหรับ class-level decorators
    ]);

    if (!requiredRoles) {
      // ถ้าไม่มีการระบุ Roles ที่ต้องการ ก็ถือว่าเข้าถึงได้
      return true;
    }

    // 2. ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่จาก Request Object
    const { user } = context.switchToHttp().getRequest();

    // 3. ตรวจสอบว่าผู้ใช้มี Role ที่ต้องการหรือไม่
    // user.roles คือ array of roles ของผู้ใช้ที่ล็อกอินอยู่
    // requiredRoles คือ array of roles ที่ Endpoint นี้ต้องการ
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );

    if (!hasRequiredRole) {
      console.warn(
        `User ${user.username} (Roles: ${user.roles}) does not have required roles: ${requiredRoles}`,
      );
    }

    return hasRequiredRole;
  }
}
