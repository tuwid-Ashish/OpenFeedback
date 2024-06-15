import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbconnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Username", type: "text "},
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any, req):Promise<any>{
                await dbConnect()
                try {
                   const user =  await User.findOne({
                       $or:[ {email:credentials.identifer},{username: credentials.identifer}],
                    })
                    if(!user){
                        throw new Error("user doesn't exist with given email ")
                    }
                    if(!user.isverified){
                        throw new Error("please verify your account")
                    }
                    const checkpassword = await bcrypt.compare(credentials.password,user.password)
                    
                    if(checkpassword){
                        return user
                    }else{
                        throw new Error("Password is not correct")
                    }
                  
                } catch (error:any) {
                    throw new Error(error)
                }
            },
            })
        ],
        callbacks:{
          async  jwt({token, user}){
            if (user) {
                token.id = user._id?.toString()
                token.isverified = user.isverified
                token.isAcceptMessage = user.isAcceptMessage
                token.username = user.username
            }
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.isverified = token.isverified
                session.user.isAcceptMessage = token.isAcceptMessage
                session.user.username = token.username
            }
            return session
        },
        },
        pages:{
            signIn: "/sign-in"
        },
        session:{
            strategy:"jwt"
        },
        secret:process.env.NEXTAUTH_URL
    
}