import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs
import { Role } from 'src/common/enums/role.enum';

// Define user roles

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // เพิ่ม timestamps เพื่อให้มี createdAt และ updatedAt
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // จะถูก Hash ก่อนบันทึกลง DB

  @Prop({ type: [String], enum: Role, default: [Role.User] }) // Array of roles
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Only hash if password was modified
    this.password = await bcrypt.hash(this.password, 10); // Hash with salt rounds = 10
  }
  next();
});
