import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "./lib/db";
import { getUserById } from "./utils/auth/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./utils/auth/two-factor-confirmation";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow OAuth without verification
      if (account?.provider !== "Credentials") return true;

      if (user.id) {
        const existingUser = await getUserById(user.id);
        
        // Prevent signin without verification
        if (!existingUser?.emailVerified) {
          return false;
        }
        // check for 2FA
        if(existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation=await getTwoFactorConfirmationByUserId(existingUser.id);
          if(!twoFactorConfirmation) return false

          // delete 2fa for next signin
          await prisma.twoFactorConfirmation.delete({
            where:{id:twoFactorConfirmation.id}
          })
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
