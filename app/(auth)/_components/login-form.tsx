"use client";
import React, { useState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CardWrapper } from "./card-wrapper";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { LoginSchema } from "@/schemas/auth";
import { login } from "@/actions/auth/login";
import { login_action } from "../actions";
import { useAuthStore } from "@/stores/useAuthStore";
import { Router } from "lucide-react";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import toast from "react-hot-toast";

export const LoginForm = () => {
  const { isOpen, onToggleModal } = useAuthModalStore();
  const { setUser } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const UrlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with a different provider"
      : "";

  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log(searc);
  // }, []);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    toast.error("Please use google or github");
    // startTransition(() => {
    //   login_action(values)
    //   .then((data) => {
    //     if (data?.success) {
    //       form.reset();
    //       setUser({
    //         email:data.success.email as string,
    //         id:data.success.id as string,
    //         name:data.success.name as string,
    //       });
    //       onToggleModal();
    //       router.push("/")
    //     }
    //     if (data?.error) {
    //       // form.reset();
    //       setError(data.error);
    //     }
    //     // if(data?.twoFactor){
    //     //   setShowTwoFactor(true)
    //     // }
    //   });
    //   // .catch(()=>setError("Something went wrong")
    //   // )
    // });
  };
  return (
    <CardWrapper
      headerLabel="Welcome back 💖"
      backButtonLabel="Dont have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TwoFactor Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button size="sm" variant="link" asChild className="px-0 font-normal">
            <Link href="/auth/reset-password">Forgot password</Link>
          </Button>

          {<FormSuccess message={success} />}
          {<FormError message={error || UrlError} />}

          <Button className="w-full" type="submit" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
