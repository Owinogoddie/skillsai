"use client";
import React, { useState, useTransition } from "react";
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

import { ResetPasswordSchema } from "@/schemas/auth";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { resetPassword } from "@/actions/auth/reset-password";
import { CardWrapper } from "./card-wrapper";

export const ResetPasswordForm = () => {

  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      resetPassword(values).then((data) => {
        if (data?.success) {
          setSuccess(data.success);
        }
        if (data?.error) {
          setError(data.error);
        }
      });
    });
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         

          {<FormSuccess message={success} />}
          {<FormError message={error } />}

          <Button className="w-full" type="submit" disabled={isPending}>
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
