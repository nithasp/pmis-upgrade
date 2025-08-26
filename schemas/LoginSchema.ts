import { z } from "zod";

export const LoginValidationSchema = z.object({
    email: z.string().email("Email is not valid"),
    password: z.string().min(1, "Required")
})
