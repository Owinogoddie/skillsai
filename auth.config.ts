import  Credentials  from 'next-auth/providers/credentials';
import  Github  from 'next-auth/providers/github';
import  Google  from 'next-auth/providers/google';
import { compare } from 'bcryptjs';

import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas/auth"
import { getUserByEmail } from "./utils/auth/user"

export default { providers: [
    Github({
        clientId:process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
        async authorize(credentials){
            const validatedValues=LoginSchema.safeParse(credentials);
            if(validatedValues.success){
                const {email,password}=validatedValues.data

                const user=await getUserByEmail(email);
                if(!user || !user.password) return null;

                const passwordMatch=await compare(password,user.password) 

                if(passwordMatch){
                    return user
                }
                
            }
            return null
        }
    })
] } satisfies NextAuthConfig