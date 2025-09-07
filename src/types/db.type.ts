import { Document,Types } from "mongoose"

export interface UserDocumentType extends Document { 
  _id: Types.ObjectId;
  username: string;
  password: string;
  is_admin: boolean;
} 

export type UserQueryParams = {
  id?: Types.ObjectId;
  username?: string;
  password?: string;
  is_admin?: boolean;
}