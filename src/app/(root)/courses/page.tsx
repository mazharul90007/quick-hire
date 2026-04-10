"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { normalizeUserRole } from "@/lib/roles";
import { useCourseCheckout, useMyCoursePurchases, usePublishedCourses } from "@/hooks/useCourse";
import { Button } from "@/components/ui/button";
import { formatCourseMajorPrice } from "@/lib/course-price";
import { BookOpen, Clock3, GraduationCap } from "lucide-react";

function durationLabel(d: string) {
  return d.replace(/_/g, " ");
}

export default function PublicCoursesPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: courses = [], isLoading } = usePublishedCourses();
  const checkout = useCourseCheckout();

  const role = normalizeUserRole(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session?.user as any)?.role as string | undefined,
  );
  const isApplicant = role === "APPLICANT";
  const isBlockedRole = role === "ADMIN" || role === "SUPER_ADMIN" || role === "RECRUITER";

  const { data: purchases = [] } = useMyCoursePurchases(Boolean(session && isApplicant));

  const activeOwnedCourseIds = useMemo(() => {
    const now = Date.now();
    return new Set(
      purchases
        .filter((p) => {
          if (p.status !== "PAID") return false;
          if (!p.accessExpiresAt) return true;
          return new Date(p.accessExpiresAt).getTime() > now;
        })
        .map((p) => p.course.id),
    );
  }, [purchases]);

  return (
    <div className="pb-16 pt-16 md:pt-20">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0">
            <Image
              src="/assets/images/course.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/55 to-black/30" />
          </div>

          <div className="relative z-10 px-6 py-14 sm:px-10 sm:py-20 lg:max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              <GraduationCap className="h-3.5 w-3.5" />
              QuickHire learning
            </p>
            <h1 className="mt-5 font-clash text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build career-ready skills with practical courses
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              Learn job-focused skills and unlock access instantly after purchase.
              Keep your profile competitive with curated, industry-relevant content.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-lg">
                <Link href="#course-catalog">Explore courses</Link>
              </Button>
              {!session ? (
                <Button asChild variant="secondary" className="rounded-lg">
                  <Link href="/login">Sign in to buy</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section
        id="course-catalog"
        className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Catalog
            </p>
            <h2 className="mt-1 font-clash text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Published courses
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${courses.length} available`}
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading courses...</p>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
            No published courses yet.
          </div>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => {
              const alreadyBought = activeOwnedCourseIds.has(c.id);
              const canBuy = isApplicant && !alreadyBought;
              const disabledForRole = isBlockedRole;

              return (
                <li key={c.id} className="h-full">
                  <article className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-5 py-4">
                      <h3 className="line-clamp-2 font-clash text-xl font-semibold tracking-tight text-foreground">
                        {c.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {formatCourseMajorPrice(c.priceAmount, c.currency)}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col px-5 py-4">
                      {c.description ? (
                        <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                          {c.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Professional course content for career growth.
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {durationLabel(c.accessDuration)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          Course access
                        </span>
                      </div>

                      <div className="mt-6">
                        {!session ? (
                          <Button
                            className="w-full rounded-lg"
                            onClick={() => router.push("/login")}
                          >
                            Buy now
                          </Button>
                        ) : alreadyBought ? (
                          <Button className="w-full rounded-lg" disabled variant="secondary">
                            Already bought
                          </Button>
                        ) : disabledForRole ? (
                          <Button className="w-full rounded-lg" disabled variant="secondary">
                            Not available for your role
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-lg"
                            disabled={checkout.isPending || !canBuy}
                            onClick={() => checkout.mutate(c.id)}
                          >
                            {checkout.isPending ? "Redirecting..." : "Buy now"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
