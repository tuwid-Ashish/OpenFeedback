import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import { Messages } from "@/models/User";

export async function POST(Request: Request) {
    await dbConnect()
    const { content, username } = await Request.json()
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        if (!user.isAcceptMessage) {
            return Response.json({
                success: false,
                message: "User not accept message"
            }, { status: 401 })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Messages)
        await user.save()
        return Response.json({
            success: true,
            message: "Message sent successfully",
            newMessage
        }, { status: 200 })

    } catch (error: any) {
        console.log("error sending message", error.message);
    
        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500
        })
    }
}