import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorId: string; // Optional: If you want to track who created the post
}
