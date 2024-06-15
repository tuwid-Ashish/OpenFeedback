import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";

export async function POST(Request: Request) {
    await dbConnect()
    try {
        const { username, code } = await Request.json()
        const DecodedUsername = decodeURIComponent(username)
        const user = await User.findOne({ username: DecodedUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpire) > new Date()
        if (isCodeValid && isCodeExpired) {
            user.isverified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Account verified successfully"
            },
                { status: 200 })
        } else if (!isCodeExpired) {
            // Code has expired
            return Response.json(
                {
                    success: false,
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        } else {
            return Response.json({
                success: false,
                message: "Invalid code"
            }, { status: 500 })
        }
    } catch (error: any) {
        Response.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}