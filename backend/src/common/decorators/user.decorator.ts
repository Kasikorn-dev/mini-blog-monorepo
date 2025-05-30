// src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // ข้อมูล user ที่ถูกแนบโดย JwtStrategy.validate() จะอยู่ใน request.user
    return data ? request.user[data as string] : request.user;
  },
);
