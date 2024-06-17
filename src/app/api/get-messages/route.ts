import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import { User as AuthUser } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";


export async function GET(Request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(AuthOptions)
        const user = session?.user as AuthUser;
        if(!session||!user){
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 
            })
        }
        const foundUser = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(user._id) } },
            { $unwind: "$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id: "$_id", messages:{$push:"$messages"}}},
        ])

          if (!foundUser|| foundUser.length === 0 ) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 401 
            })
          }

          return Response.json({
            success: true,
            message: foundUser[0].messages,
            
        }, { status: 200
        }) 
    } catch (error:any) {
        console.log("error sending message", error.message);
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500
        })
    }
}