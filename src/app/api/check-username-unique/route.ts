import User from "@/models/User"
import {usernamevalidation} from "@/schemas/signUpSchema"
import dbConnect from "@/lib/dbconnect"
import { z } from "zod"

const UsernameQuerySchema = z.object({
    username:usernamevalidation
})

export async function GET(req:Request){
  await dbConnect()

  try {
    
    const {searchParams} = new URL(req.url)
    const queryprams = {  
        username: searchParams.get("username")}
    const result = UsernameQuerySchema.safeParse(queryprams)


    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success: false,
            message: usernameErrors?.length> 0? usernameErrors : "invalid username",
        },{status:400})
    }
    const {username} = result.data

    const existingUser =  await User.findOne({username, isverified : true})
     if(existingUser){
        return Response.json({
            success:false,
            message:"username already taken"
        },{status:400})
    }
    return Response.json({
        success:true,
        message:"username is good to go"
    },{status:400})

    
  } catch (error:any) {
    console.error("Error while checking username uniqueness",error.message);
    
    return Response.json({
        success: false,
        message: error.message,
    },{status:400})
}

}