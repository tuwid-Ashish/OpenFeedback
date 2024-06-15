import { AuthOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import { User as AuthUser } from "next-auth";
import exp from "constants";

export async function POST(Request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(AuthOptions)
        const user = session?.user as AuthUser;
        if (!session || session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }
        const { acceptMessage } = await Request.json()
        const updatedUser = await User.findByIdAndUpdate(user._id,{
            isAcceptMessage:acceptMessage
        })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "Accept message updated successfully",
            updatedUser
        }, { status: 200 })

    } catch (error:any) {
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500
        })
    }
}

export async function GET(Request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(AuthOptions)
        const user = session?.user as AuthUser;
        if (!session || session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }
         const foundUser = await User.findById(user._id)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "User found",
            isAcceptMessage:foundUser.isAcceptMessage
        }, { status: 200
        })    

    } catch (error:any) {
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500
        })
    }
}