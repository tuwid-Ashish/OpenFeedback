import { resend } from "@/lib/resend";
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationEmail(
    email:string,
    verifyCode:string,
    username:string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'openFeedback |verficaiton code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success:true,
            message:"verification email send successfully"
        }
    } catch (error) {
            console.log("error sending verifcation email", error);
            return {
                success:false,
                message:"Error sending verification email"
            }
            
    }
}

