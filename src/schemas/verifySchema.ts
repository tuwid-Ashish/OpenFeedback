import { z } from "zod";

export const VerifySchema = z.object({
    verifyCode: z.string().length(6, "Verify code must be 6 characters long")
})