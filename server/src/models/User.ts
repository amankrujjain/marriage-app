import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import { AuthProvider, UserRole } from '@marriage/shared';

export interface UserFields {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  authProvider: AuthProvider;
  googleId?: string;
  role: UserRole;
  premiumUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserFields>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },
    googleId: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    premiumUntil: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export type UserDocument = HydratedDocument<UserFields> & { _id: Types.ObjectId };

export const UserModel = model<UserFields>('User', userSchema);
