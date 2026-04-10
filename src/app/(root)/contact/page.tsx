import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-background via-muted/20 to-background pt-20 pb-16">
      <div className="container mx-auto max-w-2xl px-4 md:px-6">
        <header className="mb-10 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <MessageCircle className="h-3.5 w-3.5" />
            Contact
          </div>
          <h1 className="font-clash text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get in touch
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Questions about hiring, partnerships, or support? We&apos;d like to
            hear from you.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Email</h2>
              <p className="text-sm text-muted-foreground">
                For general inquiries and support.
              </p>
              <a
                href="mailto:support@quickhire.local"
                className="text-sm font-medium text-primary hover:underline"
              >
                support@quickhire.local
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prefer to browse first?{" "}
          <Link href="/jobs" className="font-medium text-primary hover:underline">
            View open roles
          </Link>
        </p>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
