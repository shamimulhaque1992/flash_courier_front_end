"use client";

import { Camera, Pencil, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  useGetMyRiderProfile,
  useUpdateRiderProfile,
  useUploadProfileImage,
} from "@/hooks/profile.hook";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
      <span className="w-48 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

const FIELDS = [
  { key: "name", label: "Name" },
  { key: "contactNumber", label: "Contact Number" },
  { key: "thana", label: "Thana" },
  { key: "district", label: "District" },
  { key: "address", label: "Address" },
  { key: "vehicleType", label: "Vehicle Type" },
  { key: "vehicleRegistrationNumber", label: "Vehicle Reg. No." },
  { key: "licenseNumber", label: "License Number" },
] as const;

type FormState = Record<typeof FIELDS[number]["key"], string>;

export default function RiderProfile() {
  const { data, isLoading } = useGetMyRiderProfile();
  const { mutate: update, isPending: isUpdating } = useUpdateRiderProfile();
  const { mutate: uploadImage, isPending: isUploading } = useUploadProfileImage("my-rider-profile");
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", contactNumber: "", thana: "", district: "", address: "",
    vehicleType: "", vehicleRegistrationNumber: "", licenseNumber: "",
  });

  const profile = data?.data;

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        contactNumber: profile.contactNumber ?? "",
        thana: profile.thana ?? "",
        district: profile.district ?? "",
        address: profile.address ?? "",
        vehicleType: profile.vehicleType ?? "",
        vehicleRegistrationNumber: profile.vehicleRegistrationNumber ?? "",
        licenseNumber: profile.licenseNumber ?? "",
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  if (!profile) return <p className="text-muted-foreground">Failed to load profile.</p>;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage(file, {
      onSuccess: () => toast.add({ title: "Profile image updated", type: "success" }),
      onError: (err) => toast.add({ title: "Upload failed", description: err.message, type: "error" }),
    });
    e.target.value = "";
  };

  const handleSave = () => {
    update(
      {
        name: form.name || undefined,
        contactNumber: form.contactNumber || undefined,
        thana: form.thana || undefined,
        district: form.district || undefined,
        address: form.address || undefined,
        vehicleType: form.vehicleType || undefined,
        vehicleRegistrationNumber: form.vehicleRegistrationNumber || undefined,
        licenseNumber: form.licenseNumber || undefined,
      },
      {
        onSuccess: () => {
          toast.add({ title: "Profile updated", type: "success" });
          setEditing(false);
        },
        onError: (err) => toast.add({ title: "Update failed", description: err.message, type: "error" }),
      },
    );
  };

  return (
    <div className="divide-y rounded-xl ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile.user?.imageUrl ? (
              <Image
                src={profile.user.imageUrl}
                alt={profile.name}
                width={56}
                height={56}
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-xl font-bold uppercase">
                {profile.name[0]}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/80 disabled:opacity-50"
            >
              <Camera className="size-3" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          </div>
          <div>
            <p className="text-lg font-semibold">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
              {profile.verificationStatus.toLowerCase()}
            </span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
          {editing ? <><X className="size-4" /> Cancel</> : <><Pencil className="size-4" /> Edit</>}
        </Button>
      </div>

      {editing ? (
        <div className="space-y-3 p-6">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-48 shrink-0 text-sm text-muted-foreground">{label}</span>
              <Input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="max-w-sm"
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="divide-y px-6">
          <Row label="Contact Number" value={profile.contactNumber} />
          <Row label="NID Number" value={profile.nidNumber} />
          <Row label="Vehicle Type" value={profile.vehicleType} />
          <Row label="Vehicle Reg. No." value={profile.vehicleRegistrationNumber} />
          <Row label="License Number" value={profile.licenseNumber} />
          <Row label="Address" value={profile.address} />
          <Row label="Thana" value={profile.thana} />
          <Row label="District" value={profile.district} />
          <Row label="Division" value={profile.division} />
        </div>
      )}
    </div>
  );
}
