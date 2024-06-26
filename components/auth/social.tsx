"use client"
import React from 'react'
import {signIn} from "next-auth/react"

import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import { Button } from '../ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

const Social = () => {
  const handleSocialLogin=(provider:"google" | "github")=>{
    signIn(provider,{
      callbackUrl:DEFAULT_LOGIN_REDIRECT
    })

  }
  return (
    <div className="flex w-full items-center gap-x-2">
        <Button variant="outline" size="lg" className="w-full" onClick={()=>handleSocialLogin("google")}>
            <FcGoogle className="h-5 w-5"/>
        </Button>
        <Button variant="outline" size="lg" className="w-full" onClick={()=>handleSocialLogin("github")}>
            <FaGithub className="h-5 w-5"/>
        </Button>
    </div>
  )
}

export default Social