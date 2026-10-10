import ReviewsTable from "@/components/modules/reviews/reviews-table";

export default function RiderReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">Reviews customers have left for your deliveries.</p>
      </div>
      <ReviewsTable role="rider" />
    </div>
  );
}
