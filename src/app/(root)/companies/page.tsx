"use client";

import Link from "next/link";
import { useGetIndustries } from "@/hooks/useIndustry";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";

export default function CompaniesPage() {
  const { data: industries = [], isLoading } = useGetIndustries();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background via-muted/20 to-background pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <header className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Industries API
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-clash text-foreground tracking-tight">
            Browse by industry
          </h1>
          <p className="text-muted-foreground font-epilogue text-lg leading-relaxed">
            Data from{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              GET /industries
            </code>
            . Jump into active jobs for any vertical.
          </p>
        </header>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-muted animate-pulse border border-border/50"
              />
            ))}
          </div>
        ) : industries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground font-epilogue">
            No industries yet. Staff can create them from the dashboard.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold font-clash text-lg text-foreground">
                        {ind.name}
                      </h2>
                      <p className="text-xs text-muted-foreground font-epilogue mt-0.5">
                        {(ind.subIndustries?.length ?? 0)} sub-industries
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-lg font-bold bg-primary hover:bg-primary/90"
                  >
                    <Link href={`/jobs?industryId=${ind.id}`}>
                      View jobs
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Button asChild variant="outline" className="rounded-xl font-bold">
            <Link href="/jobs">
              <Building2 className="mr-2 h-4 w-4" />
              All jobs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
