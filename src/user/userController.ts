import type { Request,Response,NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";


const createUser=async(req:Request,res:Response,next:NextFunction)=>{
    const{name,email,password}=req.body;
    //validation
    if(!name || !email || !password){
        //use global error handler
        const error=createHttpError(400,"all fields are required");
        //client error status code
        return next(error);//next keyword passes the error

        
    }
    //database checking for duplicacy
    const user = await userModel.findOne({email: email})
    if(user){
        const error= createHttpError(400,"user already exists with this email");
        return next(error)
    }
    //process

    //response

res.json({message:"user created"})

}
export {createUser}