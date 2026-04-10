"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, RefreshCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const purchaseId = searchParams.get("purchase_id");
  const courseId = searchParams.get("course_id");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="font-clash text-3xl font-bold text-zinc-900">
              Payment failed or cancelled
            </h1>
            <p className="mt-1 font-epilogue text-sm text-zinc-600">
              We could not complete your course payment.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-red-200/70 bg-white p-4">
          <p className="font-epilogue text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Reason:</span>{" "}
            {reason || "Unknown"}
          </p>
          <p className="font-epilogue text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Purchase ID:</span>{" "}
            {purchaseId || "Not available"}
          </p>
          <p className="font-epilogue text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Course ID:</span>{" "}
            {courseId || "Not available"}
          </p>
        </div>

        <div className="mt-5 space-y-2 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="flex items-center gap-2 font-epilogue text-sm text-zinc-700">
            <ShieldAlert className="h-4 w-4 text-zinc-500" />
            No amount is captured if checkout is canceled before payment.
          </p>
          <p className="flex items-center gap-2 font-epilogue text-sm text-zinc-700">
            <RefreshCcw className="h-4 w-4 text-zinc-500" />
            You can retry checkout anytime from the courses page.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/applicant/courses">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/courses">Go to Course Catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="font-epilogue text-zinc-500">Loading…</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
