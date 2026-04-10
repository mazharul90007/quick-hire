import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";

const footerLinkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-muted/45 text-foreground dark:bg-muted/25">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-primary/6 to-transparent dark:from-primary/8"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="space-y-6 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="relative block h-9 w-10 shrink-0">
                <Image
                  src="/assets/images/quick-hire-images/quick_hire_logo.png"
                  alt=""
                  fill
                  className="object-contain object-left"
                  sizes="40px"
                />
              </span>
              <span className="font-clash text-xl font-semibold tracking-tight text-foreground">
                QuickHire
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Connect talented people with great teams. Search roles, build your
              profile, and hire with clarity—all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/15 transition hover:bg-primary/90"
              >
                <Briefcase className="size-4" aria-hidden />
                Post a job
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
              >
                Find jobs
                <ArrowUpRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                For candidates
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/jobs" className={footerLinkClass}>
                    Browse jobs
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className={footerLinkClass}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className={footerLinkClass}>
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className={footerLinkClass}>
                    Create account
                  </Link>
                </li>
                <li>
                  <Link href="/login" className={footerLinkClass}>
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className={footerLinkClass}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={footerLinkClass}>
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="/forgot-password" className={footerLinkClass}>
                    Forgot password
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Stay in touch
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <a
                  href="mailto:support@quickhire.local"
                  className="transition-colors hover:text-foreground"
                >
                  support@quickhire.local
                </a>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>Built for teams hiring anywhere</span>
              </li>
            </ul>
            <div className="mt-8 flex gap-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-[18px]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                aria-label="X (Twitter)"
              >
                <Twitter className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} QuickHire. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Job portal you can trust</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
