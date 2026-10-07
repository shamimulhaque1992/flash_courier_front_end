import CustomerProfile from "@/components/modules/profile/customer-profile";

export default function CustomerProfilePage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">My Profile</h1>
      <CustomerProfile />
    </div>
  );
}
