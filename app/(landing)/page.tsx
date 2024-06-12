"use client";
import { AvatarDemo } from "@/components/avatar";
import { LoginModal } from "@/components/modals/auth-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut, User2 } from "lucide-react";
import { useEffect } from "react";

import { useAuthModalStore } from "@/stores/useAuthModalStore";
import Link from "next/link";
import { UserButton } from "@/components/user-btn";
import { CourseModal } from "./_components/course-modal";
import { LinearCombobox } from "@/components/linear-combo";
import { searchYoutube } from "@/lib/youtube";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { user, logout } = useAuthStore();
  const { onOpen } = useAuthModalStore();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const results = await searchYoutube("React");
  //       console.log(results);
  //     } catch (error) {
  //       console.error("Failed to fetch YouTube results:", error);
  //     }
  //   };

  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <div className="">
      <div className="flex items-center justify-between min-h-16 w-full  bg-gray-200 px-20 md:px-36">
        <span className="font-extrabold text-xl cursor-pointer">Logo</span>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <CourseModal />
              <Button variant="outline" size="sm">
                <Link href="/dashboard">Browse Courses</Link>
              </Button>
              {/* user btn */}
              <UserButton />
            </>
          ) : (
            <Button
              variant="secondary"
              className="text-semi-bold"
              onClick={onOpen}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      <LoginModal />

      <div className="p-6"> Landing Page
        <LinearCombobox/>
      </div>
    </div>
  );
}
