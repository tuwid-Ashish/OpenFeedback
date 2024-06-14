import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import bycrpt from "bcryptjs";
import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByusername = await User.findOne({
            username,
            isverified: true
        })
        if (existingUserVerifiedByusername) {
            return Response.json({
                success: false,
                message: "user already exist with this username"
            }, { status: 400 })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const existingUserByEmail = await User.findOne({
            email,
        })

        if (existingUserByEmail) {
            if (existingUserByEmail.isverified) {
                return Response.json({
                    success: false,
                    message: "user already exist with this email"
                }, { status: 400 })
            } else {
                const hashPassword = await bycrpt.hash(password, 10)
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashPassword = await bycrpt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            await new User({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isverified: false,
                messages: []
            }).save()
        }
        // send verification email
        const emailResponse = await SendVerificationEmail(
            email,
            verifyCode,
            username
        )

        if (emailResponse.success!) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User register successfully"
        }, { status: 201 })
        
    } catch (error) {
        console.log("error while sign up user ", error);

        return Response.json({
            success: false,
            message: "server side error on signup"
        }, { status: 500 })

    }
}