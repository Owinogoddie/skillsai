"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { newVerification } from "@/actions/auth/new-verification";
import { useSearchParams } from "next/navigation";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const NewVerificationForm = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) return;

    newVerification(token).then((data) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
      }
    });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  if (!token) {
    return null;
  }

  return (
    <CardWrapper
      headerLabel="Confirming your Email 💖"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        {success && <FormSuccess message={success} />}
        {error && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
