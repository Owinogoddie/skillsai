"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas/auth";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/utils/auth/user";
import { getVerificationTokenByEmail } from "@/utils/auth/verification-token";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/utils/auth/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/utils/auth/mail";
import { getTwoFactorTokenByEmail } from "@/utils/auth/two-factor-token";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid Fields" };
  }

  const { email, password, code } = validatedValues.data;

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "User does not exist" };
    }
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser?.email
      );

      const existingToken = await getVerificationTokenByEmail(email);
      if (existingToken) {
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
          await sendVerificationEmail(email, verificationToken);
          return { success: "New Verifiation token to your email" };
        } else {
          return { error: "Email not verified Please visit your email" };
        }
      }

      if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
          // verify code
          const twofactortoken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
          if (!twofactortoken) {
            return { error: "Invalid code" };
          }
          if (twofactortoken.token !== code) {
            return { error: "Invalid code" };
          }
        } else {
          const twoFactorToken = await generateTwoFactorToken(
            existingUser.email
          );
          await sendTwoFactorEmail(twoFactorToken.token, twoFactorToken.email);
          return { twoFactor: true };
        }
      }
      await signIn("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
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
