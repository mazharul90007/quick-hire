"use client";

import Image from "next/image";
import { Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import districts from "../shared/districts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeroSection = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [district, setDistrict] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (district) params.set("district", district);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/jobs?searchTerm=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative min-h-[560px] lg:min-h-[620px] overflow-hidden">
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 10% 20%, oklch(0.58 0.14 195 / 0.45), transparent 55%),
            radial-gradient(ellipse 80% 60% at 90% 10%, oklch(0.55 0.22 290 / 0.28), transparent 50%),
            radial-gradient(ellipse 60% 50% at 70% 90%, oklch(0.72 0.1 195 / 0.15), transparent 45%),
            oklch(0.97 0.015 240)
          `,
        }}
      />
      <div className="absolute inset-0 opacity-[0.35] mix-blend-soft-light pointer-events-none">
        <Image
          src="/assets/images/Pattern.svg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <h1 className="font-clash text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              Find work that
              <span className="block mt-1 bg-linear-to-r from-primary via-teal-600 to-fuchsia-600 bg-clip-text text-transparent">
                moves your career
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed font-epilogue">
              Search curated roles, filter by industry and location, and apply
              in one flow — powered by your QuickHire API.
            </p>

            <form
              onSubmit={handleSearch}
              className="rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_20px_60px_-20px_oklch(0.35_0.06_260/0.4)] backdrop-blur-md flex flex-col sm:flex-row gap-2 sm:items-stretch max-w-xl"
            >
              <div className="flex flex-1 items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-border/60">
                <Search className="text-primary h-5 w-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Role, skill, or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm font-epilogue"
                />
              </div>
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <MapPin className="text-primary h-5 w-5 shrink-0" />
                <Select
                  onValueChange={(value) => setDistrict(value)}
                  value={district}
                >
                  <SelectTrigger className="w-full border-0 shadow-none h-auto p-0 font-epilogue text-sm bg-transparent focus:ring-0">
                    <SelectValue placeholder="District (optional)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl">
                    {districts.map((d) => (
                      <SelectItem key={d} value={d} className="font-epilogue">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="h-12 sm:h-auto sm:px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
              >
                Search jobs
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-epilogue">
              <span className="font-semibold text-foreground/80">Popular:</span>
              {["Designer", "Engineer", "Marketing", "Remote"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full bg-white/50 hover:bg-white border border-border/50 px-3 py-1 text-xs font-bold text-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-tr from-primary/20 via-transparent to-fuchsia-500/20 blur-2xl" />
              <Image
                src="/assets/images/hero-man.png"
                alt="Professional using QuickHire"
                width={420}
                height={580}
                className="relative drop-shadow-2xl object-contain mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
