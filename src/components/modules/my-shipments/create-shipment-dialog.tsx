"use client";

import { useForm } from "@tanstack/react-form";
import { Package, MapPin, Phone, Mail, User, Calculator } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useCalculateShipmentPrice,
  useCreateShipment,
  useGetMyMerchantProfile,
} from "@/hooks/shipment.hook";
import { createShipmentSchema } from "@/validation";
import type { PricingResult } from "@/types";
import z from "zod";

type FormValues = z.infer<typeof createShipmentSchema>;

const DIVISIONS = [
  "DHAKA",
  "CHATTOGRAM",
  "RAJSHAHI",
  "KHULNA",
  "BARISAL",
  "SYLHET",
  "RANGPUR",
  "MYMENSINGH",
] as const;

const defaultValues: FormValues = {
  receiverName: "",
  receiverEmail: "",
  receiverContactNumber: "",
  receiverThana: "",
  receiverDistrict: "",
  receiverDivision: "DHAKA",
  receiverAddress: "",
  packageDescription: "",
  packageWeight: 0,
  packageDimensions: "",
  isFragile: false,
  note: "",
};

export default function CreateShipmentDialog() {
  const [open, setOpen] = useState(false);
  const [pricing, setPricing] = useState<PricingResult | null>(null);

  const { mutate: calculate, isPending: isCalculating } =
    useCalculateShipmentPrice();
  const { mutate: create, isPending: isCreating } = useCreateShipment();
  const { data: profileData } = useGetMyMerchantProfile();

  const form = useForm<FormValues>({
    defaultValues,
    validators: { onSubmit: createShipmentSchema },
    onSubmit: async ({ value }) => {
      create(
        {
          ...value,
          receiverAddress: value.receiverAddress || undefined,
          packageDescription: value.packageDescription || undefined,
          packageDimensions: value.packageDimensions || undefined,
          note: value.note || undefined,
        },
        {
          onSuccess: (res) => {
            if (!res.success || !res.data?.bkashURL) {
              toast.add({
                title: "Payment Error",
                description: "Could not initiate payment. Please try again.",
                type: "error",
              });
              return;
            }
            window.location.href = res.data.bkashURL;
          },
          onError: (err) => {
            toast.add({
              title: "Shipment Failed",
              description: err.message || "Something went wrong.",
              type: "error",
            });
          },
        },
      );
    },
  });

  const handleCalculate = () => {
    const values = form.state.values;
    if (!values.receiverDivision || !values.packageWeight) {
      toast.add({
        title: "Missing fields",
        description: "Please fill receiver division and package weight first.",
        type: "error",
      });
      return;
    }
    calculate(
      {
        senderDivision: profileData?.data?.division ?? "DHAKA",
        receiverDivision: values.receiverDivision,
        packageWeight: values.packageWeight,
        isFragile: values.isFragile,
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setPricing(res.data);
          }
        },
        onError: (err) => {
          toast.add({
            title: "Calculation Failed",
            description: err.message || "Could not calculate price.",
            type: "error",
          });
        },
      },
    );
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      form.reset();
      setPricing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Package className="size-4" />
            Create Shipment
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          noValidate
        >
          <FieldGroup>
            {/* Receiver Info */}
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Receiver Information
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="receiverName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={field.name}
                          type="text"
                          placeholder="John Doe"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="pl-9"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="receiverEmail">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="receiver@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="pl-9"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="receiverContactNumber">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Contact</FieldLabel>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={field.name}
                          type="tel"
                          placeholder="+880 1712 345678"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="pl-9"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="receiverDivision">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Division</FieldLabel>
                      <select
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(
                            e.target.value as FormValues["receiverDivision"],
                          );
                          setPricing(null);
                        }}
                        aria-invalid={isInvalid}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {DIVISIONS.map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0) + d.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="receiverThana">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Thana</FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Mirpur"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="receiverDistrict">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>District</FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Dhaka"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="receiverAddress">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Full Address{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.name}
                      type="text"
                      placeholder="House 12, Road 5..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </Field>
              )}
            </form.Field>

            {/* Package Info */}
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mt-2">
              Package Information
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="packageWeight">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Weight (kg)</FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        min={0.1}
                        step={0.1}
                        placeholder="2.5"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(parseFloat(e.target.value) || 0);
                          setPricing(null);
                        }}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="packageDimensions">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Dimensions{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      placeholder="30x20x10 cm"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="packageDescription">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Package Description{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    rows={2}
                    placeholder="Describe the package contents..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <div className="flex items-center gap-4">
              <form.Field name="isFragile">
                {(field) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.checked);
                        setPricing(null);
                      }}
                      className="size-4 rounded border-input"
                    />
                    Fragile package (+30 BDT)
                  </label>
                )}
              </form.Field>
            </div>

            <form.Field name="note">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Note{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    rows={2}
                    placeholder="Any special instructions..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            {/* Pricing section */}
            <div className="rounded-lg border bg-muted/40 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Price</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCalculate}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Spinner /> Calculating…
                    </>
                  ) : (
                    <>
                      <Calculator className="size-4" />
                      Calculate Price
                    </>
                  )}
                </Button>
              </div>

              {pricing && (
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base rate</span>
                    <span>{pricing.baseRate} BDT</span>
                  </div>
                  {pricing.weightSurcharge > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Weight surcharge</span>
                      <span>+{pricing.weightSurcharge} BDT</span>
                    </div>
                  )}
                  {pricing.fragileSurcharge > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Fragile surcharge</span>
                      <span>+{pricing.fragileSurcharge} BDT</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{pricing.totalFee} BDT</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pricing.breakdown.isIntraDivision
                      ? "Same-division delivery"
                      : "Inter-division delivery"}{" "}
                    · Weight bracket: {pricing.breakdown.weightBracket} kg
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!pricing || isCreating}>
                {isCreating ? (
                  <>
                    <Spinner /> Processing…
                  </>
                ) : (
                  `Pay ${pricing ? `${pricing.totalFee} BDT` : ""} via bKash`
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
