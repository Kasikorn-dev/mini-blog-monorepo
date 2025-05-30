// src/auth/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 'jwt' refers to the strategy name
  // This guard automatically invokes the JwtStrategy to validate the token.
  // If validation fails, it throws UnauthorizedException by default.

  // You can optionally override handleRequest to customize error handling or user object retrieval
  handleRequest(err, user, info) {
    // You can throw an exception based on error or user object
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user; // Return the user object if authentication is successful
  }
}
