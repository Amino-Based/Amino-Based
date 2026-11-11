import { Star, BadgeCheck, ShieldCheck } from "lucide-react";
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
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-[#CBD5E1]"
          }`}
        />
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
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] md:rounded-[32px] shadow-2xs p-6 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Feedback
            </div>
            <h2 className="font-serif font-normal text-2xl md:text-3xl text-[#071739]">
              Customer Reviews
            </h2>
            {count > 0 ? (
              <div className="flex items-center gap-3 mt-3">
                <Stars value={average} size="w-5 h-5" />
                <span className="text-sm font-medium text-[#475569]">
                  {average.toFixed(1)} out of 5 · {count} review{count === 1 ? "" : "s"}
                </span>
              </div>
            ) : (
              <p className="text-sm text-[#64748B] mt-2">
                No laboratory reviews submitted yet for this lot.
              </p>
            )}
          </div>
        </div>

        {count > 0 && (
          <ul className="flex flex-col divide-y divide-[#E2E8F0] mb-8">
            {reviews.map((review) => (
              <li key={review.id} className="py-5">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Stars value={review.rating} />
                  <span className="text-sm font-semibold text-[#071739]">{review.author}</span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified Order
                    </span>
                  )}
                  {review.createdAt && (
                    <span className="text-xs text-[#94A3B8]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                {review.comment && (
                  <p className="text-sm text-[#475569] leading-relaxed mt-1">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        <ReviewForm familyProductIds={familyProductIds} eligibility={eligibility} />
      </div>
    </section>
  );
}
