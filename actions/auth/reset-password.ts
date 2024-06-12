"use server";
import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/utils/auth/user";
import { generatePasswordResetToken } from "@/utils/auth/tokens";
import { sendPasswordResetEmail } from "@/utils/auth/mail";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validatedValues = ResetPasswordSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid Email" };
  }

  const { email } = validatedValues.data;

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email) {
      return { error: "Email does not exist" };
    } else {
      const passwordResetToken = await generatePasswordResetToken(
        existingUser?.email
      );

      await sendPasswordResetEmail(existingUser.email, passwordResetToken);
      return { success: "Check your email for reset token" };
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
