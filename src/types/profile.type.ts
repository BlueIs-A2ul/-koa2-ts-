import { Types } from "mongoose";

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface Profile {
  userId: Types.ObjectId;
  avatar?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  birthday?: Date;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileCreationAttributesType {
  userId: Types.ObjectId;
  avatar?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  birthday?: Date;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
}