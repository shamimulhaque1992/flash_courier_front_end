"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  useVerifyAccount,
  useVerifyMerchantEmail,
  useVerifyRiderEmail,
} from "@/hooks";
import { toast } from "@/components/ui/toast";

const RESEND_COOLDOWN = 120;

type Mode = "customer" | "merchant" | "rider";

export default function VerifyAccountForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verifyCustomer } = useVerifyAccount();
  const { mutate: verifyMerchant } = useVerifyMerchantEmail();
  const { mutate: verifyRider } = useVerifyRiderEmail();

  const verifyFn =
    mode === "merchant"
      ? verifyMerchant
      : mode === "rider"
        ? verifyRider
        : verifyCustomer;

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) router.push("/");
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    verifyFn(
      { email, otp },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Server Failure",
              description: "Something went wrong. Please try again",
              type: "error",
            });
            return;
          }

          if (mode === "merchant" || mode === "rider") {
            toast.add({
              title: "Verification Successful",
              description:
                "An admin will review your application. Please check your email in a few days.",
              type: "success",
            });
          } else {
            toast.add({
              title: "Verification Successful",
              description: "Welcome onboard!",
              type: "success",
            });
          }
          router.push("/login");
        },
        onError: (err) => {
          toast.add({
            title: "Verification Failed",
            description: err.message || "Something went wrong. Please try again",
            type: "error",
          });
        },
      },
    );
  };

  if (!email) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Account</CardTitle>
        <CardDescription>
          Please enter the OTP we sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">OTP</FieldLabel>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (isInvalid) setIsInvalid(false);
              }}
              autoComplete="off"
              name="otp"
              id="otp"
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {isInvalid && (
              <FieldError errors={[{ message: "Invalid code. Please try again." }]} />
            )}
            <FieldDescription>Resend in {resendTimer}s</FieldDescription>
          </Field>
        </form>
      </CardContent>
      <CardFooter>
        <Button disabled={resendTimer > 0}>Resend</Button>
        <Button type="submit" form="otp-form">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
