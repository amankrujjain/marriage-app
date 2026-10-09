import { AuthProvider } from '@marriage/shared';
import { UserModel, type UserDocument } from '../models/User';

export interface CreateEmailUserInput {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
}

export interface CreateGoogleUserInput {
  name: string;
  email: string;
  googleId: string;
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  return UserModel.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id);
}

export async function findUserByGoogleId(
  googleId: string,
): Promise<UserDocument | null> {
  return UserModel.findOne({ googleId });
}

export async function createEmailUser(
  input: CreateEmailUserInput,
): Promise<UserDocument> {
  return UserModel.create({
    ...input,
    email: input.email.toLowerCase(),
    authProvider: AuthProvider.EMAIL,
  });
}

export async function createGoogleUser(
  input: CreateGoogleUserInput,
): Promise<UserDocument> {
  return UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    googleId: input.googleId,
    authProvider: AuthProvider.GOOGLE,
  });
}
