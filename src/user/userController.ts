import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

import userModel from "./userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import type { User } from "./userTypes.js";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(createHttpError(400, "All fields are required"));
    }

    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
      return next(createHttpError(400, "User already exists with this email"));
    }

      } catch (error) {
        return next(createHttpError(500,"error while getting user"))
      
    }
    let newUser:User;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

     newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
      
    } catch (error) {
      return next(createHttpError(500,"error while creating user"))
      
    }
    

    
    const token = jwt.sign(
      { sub: newUser._id },
      config.jwtSecret as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({//status code for resource creation
      message: "User created successfully",
      id: newUser._id,
      accessToken: token,
    });

  } catch (error) {
    next(error);
  }
};
const loginUser=async(req: Request, res: Response, next: NextFunction)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return next(createHttpError(400,"All fields are required"))
  }

  const user=await userModel.findOne({email});
  if(!user){
    return next(createHttpError(404,"User not found"))
  }

  const isMatch = await bcrypt.compare(password,user.password)
  if(!isMatch){
    return next(createHttpError(401,"Username or password incorrect"))
  }
  const token = jwt.sign(
      { sub: user._id },
      config.jwtSecret as string,
      { expiresIn: '7d' }
    );


  res.json({accessToken:token})
}

export { createUser,loginUser };
