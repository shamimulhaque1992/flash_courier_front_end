import ReviewsTable from "@/components/modules/reviews/reviews-table";

export default function CustomerReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">Reviews you have submitted for your deliveries.</p>
      </div>
      <ReviewsTable role="customer" />
    </div>
  );
}
