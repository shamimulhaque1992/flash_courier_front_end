import ReviewsTabs from "@/components/modules/reviews/reviews-tabs";

export default function AdminReviewsPage() {
  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">All Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all customer reviews.
        </p>
      </div>
      <ReviewsTabs role="admin" />
    </section>
  );
}
