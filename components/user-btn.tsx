"use client";
import { AvatarDemo } from "@/components/avatar";
import { LoginModal } from "@/components/modals/auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut, User2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { signIn, signOut, useSession } from "next-auth/react";

export const UserButton = () => {
  const [isMounted,setIsmounted]=useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);
  useEffect(() => {
    setIsmounted(true)
    
  }, [])

  if(!isMounted){
    return null
  }
  
  return (
    <>
      <LoginModal />

      <DropdownMenu>
                <DropdownMenuTrigger>
                  <AvatarDemo />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <div className="flex gap-2 items-center">
                      <LogOut className="h-4 w-4" /> Logout
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-disabled">
                    <div className="flex gap-2 items-center">
                      <User2 className="h-4 w-4" /> View Profile
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
    </>
  );
};
