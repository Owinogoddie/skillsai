"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas/auth";
import prisma from "@/lib/db";
import { getUserByEmail } from "@/utils/auth/user";
import { generateVerificationToken } from "@/utils/auth/tokens";
import { sendVerificationEmail } from "@/utils/auth/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedValues = RegisterSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid Fields" };
  }

  const { email, password, name } = validatedValues.data;

  const hashedpassword=await bcrypt.hash(password,10);
  const existingUser=await getUserByEmail(email)

  if(existingUser){
    return {error:"Email already in use"}
  }

  await prisma.user.create({
    data:{
        email,
        name,
        password:hashedpassword
    }
  })
const verificationToken=await generateVerificationToken(email);
try {
  sendVerificationEmail(email,verificationToken)
} catch (error) {
  return {error: "Failed to send Email"}
  
}
  return { success: "A confirmation Eail has been sent to your email, please verify" };
};
