import { Document, Types } from "mongoose"

export interface PostDocumentType extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  status: 'published' | 'draft' | 'private';
  isCommentAllowed: boolean;
  author: Types.ObjectId;
  coverImage?: string;
  images?: string[];
  views: number;
  likes: Types.ObjectId[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PostCreateParams = {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  status?: 'published' | 'draft' | 'private';
  isCommentAllowed?: boolean;
  coverImage?: string;
  images?: string[];
}

export type PostUpdateParams = {
  title?: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  status?: 'published' | 'draft' | 'private';
  isCommentAllowed?: boolean;
  coverImage?: string;
  images?: string[];
  views?: number;
  likes?: Types.ObjectId[];
  publishedAt?: Date;
}

export type PostQueryParams = {
  _id?: Types.ObjectId;
  title?: string;
  slug?: string;
  status?: 'published' | 'draft' | 'private';
  author?: Types.ObjectId;
  isCommentAllowed?: boolean;
  $or?: Array<{status?: string, author?: Types.ObjectId}>;
}