"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star, CheckCircle2 } from "lucide-react";
import { submitReview } from "@/app/product/[slug]/reviewActions";

type Props = {
  familyProductIds: Array<number | string>;
  eligibility: "ok" | "login_required" | "not_purchased" | "already_reviewed";
};

/** Star-rating form. Only customers with a paid order for the product see the form itself. */
export default function ReviewForm({ familyProductIds, eligibility }: Props) {
  const pathname = usePathname() || "/shop";
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-3.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Thank you! Your laboratory review was submitted and will appear once verified.</span>
      </div>
    );
  }
  if (eligibility === "login_required") {
    return (
      <p className="text-sm text-[#64748B]">
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
          className="underline font-semibold text-[#031B4E] hover:text-[#071739]"
        >
          Sign in
        </Link>{" "}
        to submit a review for products you have purchased.
      </p>
    );
  }
  if (eligibility === "not_purchased") {
    return (
      <p className="text-sm text-[#64748B]">
        Laboratory reviews are open exclusively to verified purchasers of this compound.
      </p>
    );
  }
  if (eligibility === "already_reviewed") {
    return (
      <p className="text-sm text-[#64748B]">
        You have already submitted a review for this compound — thank you for your feedback!
      </p>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitReview({
        familyProductIds,
        rating,
        comment,
        path: pathname,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
      <h3 className="font-serif text-lg font-normal text-[#071739]">Write a Review</h3>

      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className="p-1 focus:outline-none rounded hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-[#CBD5E1]"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        rows={4}
        placeholder="Share your analytical assay observations or product feedback (optional)…"
        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-colors"
      />

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start h-11 px-7 rounded-full bg-[#031B4E] hover:bg-[#071739] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs active:scale-98"
      >
        {isPending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
