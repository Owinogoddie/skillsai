"use client";
import React, { useState,useTransition  } from "react";


import { CardWrapper } from "@/components/auth/card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";


export const AuthErrorCard = () => {
  
  return (
    <CardWrapper
      headerLabel="Oops! something went wrong ❗"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      
      <div className="w-full flex items-center justify-center">
        <FaExclamationTriangle className="h-5 w-5 text-destructive"/>
      </div>
    </CardWrapper>
  );
};
