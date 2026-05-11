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
    <footer className="relative border-t border-border/50 bg-muted/10 text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/5 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="space-y-6 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg outline-none transition-transform hover:scale-105"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20">
                <Image
                  src="/assets/images/quick-hire-images/quick_hire_logo.png"
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="40px"
                />
              </div>
              <span className="font-clash text-xl font-bold tracking-tight text-foreground">
                QuickHire
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground font-epilogue">
              Connect talented people with great teams. Search roles, build your
              profile, and hire with clarity—all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
              >
                <Briefcase className="size-4" aria-hidden />
                Post a job
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 px-5 py-3 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-muted/50 hover:scale-[1.02] active:scale-95"
              >
                Find jobs
                <ArrowUpRight className="size-4 opacity-70" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                For candidates
              </h3>
              <ul className="space-y-4 font-epilogue">
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
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Company
              </h3>
              <ul className="space-y-4 font-epilogue">
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
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Stay in touch
            </h3>
            <ul className="space-y-4 font-epilogue">
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
            <div className="mt-8 flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-[20px]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:scale-110"
                aria-label="X (Twitter)"
              >
                <Twitter className="size-[20px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/50 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground font-epilogue">
            © {year} QuickHire. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary font-bold font-epilogue">
            <span>The professional job portal you can trust</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
