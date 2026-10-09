"use client";

import { Button } from "@/components/ui/button";

type TesterLoginButtonsProps = {
  disabled: boolean;
  onLogin: (credentials: { email: string; password: string }) => void;
};

const testerAccounts = [
  {
    label: "Tester Admin",
    email: process.env.NEXT_PUBLIC_TESTER_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_TESTER_ADMIN_PASSWORD,
  },
  {
    label: "Tester Merchant",
    email: process.env.NEXT_PUBLIC_TESTER_MERCHANT_EMAIL,
    password: process.env.NEXT_PUBLIC_TESTER_MERCHANT_PASSWORD,
  },
  {
    label: "Tester Rider",
    email: process.env.NEXT_PUBLIC_TESTER_RIDER_EMAIL,
    password: process.env.NEXT_PUBLIC_TESTER_RIDER_PASSWORD,
  },
  {
    label: "Tester Customer",
    email: process.env.NEXT_PUBLIC_TESTER_CUSTOMER_EMAIL,
    password: process.env.NEXT_PUBLIC_TESTER_CUSTOMER_PASSWORD,
  },
];

export default function TesterLoginButtons({
  disabled,
  onLogin,
}: TesterLoginButtonsProps) {
  if (
    process.env.NODE_ENV !== "development" ||
    !testerAccounts.some((account) => account.email && account.password)
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {testerAccounts.map((account) => (
        <Button
          className="w-full"
          disabled={disabled || !account.email || !account.password}
          key={account.label}
          onClick={() => {
            if (!account.email || !account.password) return;
            onLogin({ email: account.email, password: account.password });
          }}
          type="button"
          variant="outline"
        >
          {account.label}
        </Button>
      ))}
    </div>
  );
}
