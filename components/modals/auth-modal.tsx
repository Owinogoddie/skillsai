import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { LoginForm } from "@/app/(auth)/_components/login-form";

export const LoginModal = () => {
  const { isOpen, onToggleModal } = useAuthModalStore();
  const [isMounted,setIsMounted]=useState(false);
  useEffect(()=>{
    setIsMounted(true)
  },[]);
  if(!isMounted){
    return null
  }
  return (
    <Dialog onOpenChange={onToggleModal} open={isOpen}>
      <DialogContent>
        <div className="p-0 w-full">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
