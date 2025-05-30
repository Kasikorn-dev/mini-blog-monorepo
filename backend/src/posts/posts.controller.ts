import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // นำเข้า JWT Auth Guard
import { RolesGuard } from '../common/guards/roles.guard'; // นำเข้า Roles Guard
import { Roles } from '../common/decorators/roles.decorator'; // นำเข้า Roles Decorator
import { User } from '../common/decorators/user.decorator'; // นำเข้า User Decorator
import { Role } from '../common/enums/role.enum'; // นำเข้า Role Enum

@Controller('posts')
// @UseGuards(JwtAuthGuard, RolesGuard) // สามารถใช้ Guards กับทั้ง Controller ได้
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ทุกคนสามารถดู Post ได้ (ไม่ต้องล็อกอิน)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // ดู Post เดี่ยว (ไม่ต้องล็อกอิน)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // สร้าง Post - ต้องล็อกอิน (Authentication)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard) // ใช้ JWT Auth Guard
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createPostDto: CreatePostDto, @User() user) {
    // ใช้ Custom @User() Decorator
    console.log(
      `User ${user.username} (ID: ${user.userId}, Roles: ${user.roles}) is creating a post.`,
    );
    // คุณอาจจะเพิ่ม userId ของผู้สร้างลงใน Post ด้วย
    return this.postsService.create({
      ...createPostDto,
      authorId: user.userId,
    }); // สมมติว่ามี authorId ใน PostSchema
  }

  // อัปเดต Post - ต้องล็อกอินและเป็น Admin (Authorization)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // ใช้ทั้ง JWT Guard และ Roles Guard
  @Roles(Role.Admin) // กำหนดว่าต้องมี Role เป็น Admin
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user,
  ) {
    console.log(
      `User ${user.username} (ID: ${user.userId}, Roles: ${user.roles}) is updating post ${id}.`,
    );
    return this.postsService.update(id, updatePostDto);
  }

  // ลบ Post - ต้องล็อกอินและเป็น Admin (Authorization)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard) // ใช้ทั้ง JWT Guard และ Roles Guard
  @Roles(Role.Admin) // กำหนดว่าต้องมี Role เป็น Admin
  remove(@Param('id') id: string, @User() user) {
    console.log(
      `User ${user.username} (ID: ${user.userId}, Roles: ${user.roles}) is deleting post ${id}.`,
    );
    return this.postsService.remove(id);
  }
}
