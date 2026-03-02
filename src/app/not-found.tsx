import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowLeft, Home, Briefcase } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('/Pattern.svg')`,
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#4640DE]/10 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Icon/Illustration Area */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-indigo-50 rounded-none flex items-center justify-center relative z-10">
            <SearchX className="text-[#4640DE]" size={64} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-32 h-32 border-2 border-[#4640DE]/10 -z-10" />
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold font-clash text-[#4640DE]/10 absolute -top-20 left-1/2 -translate-x-1/2 select-none">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-clash text-[#2D2D2D]">
            Oops! Page not found
          </h2>
          <p className="text-[#515B6F] font-epilogue text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#4640DE] hover:bg-[#3b36c0] text-white h-14 px-8 font-bold font-epilogue shadow-lg shadow-[#4640DE]/20 group rounded-lg cursor-pointer">
              <Home
                className="mr-2 group-hover:-translate-y-0.5 transition-transform"
                size={18}
              />
              Return Home
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border-zinc-200 text-[#2D2D2D] font-bold font-epilogue rounded-lg hover:bg-zinc-50 group cursor-pointer"
            >
              <Briefcase
                className="mr-2 group-hover:-translate-y-0.5 transition-transform"
                size={18}
              />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-12 text-[#515B6F] font-epilogue text-sm">
          Think this is a mistake?{" "}
          <Link
            href="/contact"
            className="text-[#4640DE] font-bold hover:underline cursor-pointer"
          >
            Contact Support
          </Link>
        </p>
      </div>

      {/* Aesthetic Footer Detail */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-zinc-300 pointer-events-none skew-x-12">
        <div className="h-px w-12 bg-zinc-200" />
        <span className="font-clash text-xs uppercase tracking-[0.2em] font-bold">
          Quick Hire
        </span>
        <div className="h-px w-12 bg-zinc-200" />
      </div>
    </div>
  );
}
