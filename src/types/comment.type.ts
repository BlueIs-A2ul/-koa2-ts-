import { Document, Types } from "mongoose";

export interface CommentDocumentType extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  parent: Types.ObjectId | null;
  isApproved: boolean;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type CommentCreateParams = {
  content: string;
  post: Types.ObjectId;
  author: Types.ObjectId;
  parent?: Types.ObjectId;
}

export type CommentUpdateParams = {
  content?: string;
  isApproved?: boolean;
  likes?: Types.ObjectId[];
}

export type CommentQueryParams = {
  post?: Types.ObjectId;
  parent?: Types.ObjectId | null;
  author?: Types.ObjectId;
  isApproved?: boolean;
}

export type CommentReplyParams = {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
}