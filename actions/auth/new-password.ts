"use server";
import bcrypt  from 'bcryptjs';
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/utils/auth/user";
import { getPasswordResetTokenByToken } from "@/utils/auth/password-reset-token";
import prisma from '@/lib/db';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string
) => {
  const validatedValues = NewPasswordSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid details" };
  }

  if (!token) {
    return { error: "Missing token" };
  }
  
  const { password } = validatedValues.data;

  try {
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Invalid token" };
    } else {
        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired){
            return {error:"Token has expired"}
        }
      const existingUser = await getUserByEmail(
        existingToken?.email
      );
      if(!existingUser){
        return {error:"Invalid Email"}
    }

    const hashedPassword=await bcrypt.hash(password,10);
    await prisma.user.update({
        where:{
            id:existingUser.id
        },
        data:{
            password:hashedPassword
        }
    })
    await prisma.passwordResetToken.delete({
        where:{
            id:existingToken.id
        }
    })

      return { success: "Password updated" };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "invalid credentials" };

        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
