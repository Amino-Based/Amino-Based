import { Star, BadgeCheck } from "lucide-react";
import ReviewForm from "@/components/product/ReviewForm";

export type PublicReview = {
  id: string | number;
  rating: number;
  comment?: string | null;
  verifiedPurchase?: boolean;
  author: string;
  createdAt?: string;
};

function Stars({ value, size = "w-4 h-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
      ))}
    </span>
  );
}

/** Approved customer reviews for a product, with the review form for eligible buyers. */
export default function ProductReviews({
  reviews,
  familyProductIds,
  eligibility,
}: {
  reviews: PublicReview[];
  familyProductIds: Array<number | string>;
  eligibility: "ok" | "login_required" | "not_purchased" | "already_reviewed";
}) {
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return (
    <section id="reviews" className="mb-16">
      <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-inter uppercase text-xl md:text-2xl font-bold tracking-wider text-gray-900">
              Customer Reviews
            </h2>
            {count > 0 ? (
              <div className="flex items-center gap-3 mt-3">
                <Stars value={average} size="w-5 h-5" />
                <span className="text-sm text-gray-600">
                  {average.toFixed(1)} out of 5 · {count} review{count === 1 ? "" : "s"}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-3">No reviews yet.</p>
            )}
          </div>
        </div>

        {count > 0 && (
          <ul className="flex flex-col divide-y divide-black/5 mb-10">
            {reviews.map((review) => (
              <li key={review.id} className="py-5">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Stars value={review.rating} />
                  <span className="text-sm font-medium text-gray-900">{review.author}</span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified purchase
                    </span>
                  )}
                  {review.createdAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-black/5 pt-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Write a review</h3>
          <ReviewForm familyProductIds={familyProductIds} eligibility={eligibility} />
        </div>
      </div>
    </section>
  );
}
