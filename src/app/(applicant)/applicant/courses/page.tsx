"use client";

/**
 * Applicant courses hub:
 * - Lists published courses with “Buy” → Stripe Checkout.
 * - Lists your purchases; PAID rows get a PDF receipt download.
 * - Query ?checkout=success|cancel reflects return from Stripe (access still via webhook).
 */
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import {
  usePublishedCourses,
  useMyCoursePurchases,
  useCourseCheckout,
} from "@/hooks/useCourse";
import { applicantApi } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCourseMajorPrice } from "@/lib/course-price";

function CheckoutToast() {
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  useEffect(() => {
    const status = searchParams.get("checkout");
    if (status === "success") {
      toast.success(
        "Payment submitted. If access is not instant, wait a few seconds for confirmation.",
      );
      // Webhook may take a moment — refetch purchases so PAID + receipt appear.
      void qc.invalidateQueries({ queryKey: ["applicant", "course-purchases"] });
    }
    if (status === "cancel") {
      toast.message("Checkout canceled");
    }
  }, [searchParams, qc]);

  return null;
}

function ApplicantCoursesContent() {
  const { data: session } = authClient.useSession();
  const { data: courses = [], isLoading: loadingCatalog } = usePublishedCourses();
  const { data: purchases = [], isLoading: loadingPurchases } = useMyCoursePurchases(
    !!session,
  );
  const checkout = useCourseCheckout();

  const paidIds = new Set(
    purchases.filter((p) => p.status === "PAID").map((p) => p.course.id),
  );

  const downloadReceipt = async (purchaseId: string) => {
    try {
      const blob = await applicantApi.downloadCourseReceiptPdf(purchaseId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `course-receipt-${purchaseId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Receipt downloaded");
    } catch {
      toast.error("Could not download receipt");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <CheckoutToast />

      <header>
        <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Courses
        </p>
        <h1 className="font-clash text-4xl font-bold text-zinc-900">
          Learn &amp; grow
        </h1>
        <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
          Buy access with Stripe. Your receipt and access window appear below
          after payment is confirmed.
        </p>
      </header>

      <section aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="mb-4 font-clash text-2xl font-bold">
          Catalog
        </h2>
        {loadingCatalog ? (
          <p className="font-epilogue text-zinc-500">Loading courses…</p>
        ) : courses.length === 0 ? (
          <p className="font-epilogue text-zinc-500">No courses available.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {courses.map((c) => {
              const owned = paidIds.has(c.id);
              return (
                <li key={c.id}>
                  <Card className="border-zinc-200 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-clash text-lg">{c.title}</CardTitle>
                      <p className="font-epilogue text-sm text-zinc-600">
                        {formatCourseMajorPrice(c.priceAmount, c.currency)}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {c.description ? (
                        <p className="line-clamp-3 font-epilogue text-sm text-zinc-600">
                          {c.description}
                        </p>
                      ) : null}
                      {owned ? (
                        <span className="inline-block rounded-lg bg-emerald-50 px-3 py-1 font-epilogue text-xs font-semibold text-emerald-800">
                          Owned
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          className="rounded-lg bg-zinc-900 font-semibold"
                          disabled={checkout.isPending}
                          onClick={() => checkout.mutate(c.id)}
                        >
                          {checkout.isPending ? "Redirecting…" : "Buy with Stripe"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="purchases-heading">
        <h2 id="purchases-heading" className="mb-4 font-clash text-2xl font-bold">
          My purchases
        </h2>
        {!session ? (
          <p className="font-epilogue text-zinc-600">
            <Link href="/login" className="font-semibold text-zinc-900 underline">
              Sign in
            </Link>{" "}
            to see your orders.
          </p>
        ) : loadingPurchases ? (
          <p className="font-epilogue text-zinc-500">Loading purchases…</p>
        ) : purchases.length === 0 ? (
          <p className="font-epilogue text-zinc-500">No purchases yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-left font-epilogue text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-50">
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {p.course.title}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{p.status}</td>
                    <td className="px-4 py-3 text-zinc-600">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "PAID" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => void downloadReceipt(p.id)}
                        >
                          PDF
                        </Button>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ApplicantCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 font-epilogue text-zinc-500">Loading…</div>
      }
    >
      <ApplicantCoursesContent />
    </Suspense>
  );
}
