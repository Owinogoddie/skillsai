"use server"

import prisma from "@/lib/db"
import { getUserByEmail } from "@/utils/auth/user"
import { getVerificationTokenByToken } from "@/utils/auth/verification-token"

export const newVerification=async(token:string)=>{
    const existingToken= await getVerificationTokenByToken(token)
    if(!existingToken){
        return{error:"Token does not exist"}
    }
    // console.log(new Date(existingToken.expires))
    const hasExpired = new Date(existingToken.expires) < new Date();
    if(hasExpired){
        return {error:"Token has expired"}
    }

    const existingUser=await getUserByEmail(existingToken.email);
    if(!existingUser){
        return {error:"Email does not exist"}
    }

    await prisma.user.update({
        where:{id:existingUser.id},
        data:{
            emailVerified:new Date(),
            email:existingUser.email
        }
    })
    await prisma.verificationToken.delete({
        where:{id:existingToken.id}
    })

    return {success:"Email verified"}
}