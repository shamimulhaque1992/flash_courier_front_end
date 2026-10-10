import ReviewsTabs from "@/components/modules/reviews/reviews-tabs";

export default function MerchantReviewsPage() {
  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">My Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reviews left by customers for your shipments.
        </p>
      </div>
      <ReviewsTabs role="merchant" />
    </section>
  );
}
