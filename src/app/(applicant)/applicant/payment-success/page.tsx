"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, Clock3, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const purchaseId = searchParams.get("purchase_id");
  const courseId = searchParams.get("course_id");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <BadgeCheck className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="font-clash text-3xl font-bold text-zinc-900">
              Payment successful
            </h1>
            <p className="mt-1 font-epilogue text-sm text-zinc-600">
              Your checkout was submitted successfully.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-emerald-200/70 bg-white p-4">
          <p className="font-epilogue text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Status:</span>{" "}
            Submitted to Stripe
          </p>
          <p className="font-epilogue text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">Session ID:</span>{" "}
            {sessionId || "Not available"}
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
            <Clock3 className="h-4 w-4 text-zinc-500" />
            Access may take a few seconds while webhook confirmation completes.
          </p>
          <p className="flex items-center gap-2 font-epilogue text-sm text-zinc-700">
            <ReceiptText className="h-4 w-4 text-zinc-500" />
            Receipt download becomes available in your purchases table after status is
            marked as PAID.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/applicant/courses">Go to My Courses</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/courses">Back to Course Catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="font-epilogue text-zinc-500">Loading…</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
