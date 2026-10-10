import ReviewsTable from "@/components/modules/reviews/reviews-table";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Reviews</h1>
        <p className="text-sm text-muted-foreground">View and manage all customer reviews.</p>
      </div>
      <ReviewsTable role="admin" />
    </div>
  );
}
