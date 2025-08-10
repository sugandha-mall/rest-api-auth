import type { User } from "../user/userTypes";
// adjust the path as needed

export interface Book{
    _id:string;
    title:string;
    author:User;
    genre:string;
    coverImage:string;
    file:string;
    
}