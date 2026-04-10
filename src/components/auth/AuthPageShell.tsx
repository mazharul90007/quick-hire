import type { ReactNode } from "react";

export function AuthPageShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 0% -20%, oklch(0.55 0.16 195 / 0.35), transparent 55%),
            radial-gradient(ellipse 90% 60% at 100% 0%, oklch(0.55 0.2 290 / 0.22), transparent 50%),
            radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.7 0.08 195 / 0.12), transparent 45%),
            oklch(0.97 0.01 240)
          `,
        }}
      />
      <div className="absolute inset-0 bg-[url('/assets/images/Pattern.svg')] opacity-[0.04] bg-center mix-blend-multiply" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-clash text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-sm sm:text-base text-muted-foreground font-epilogue leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
