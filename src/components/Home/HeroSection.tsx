"use client";

import Image from "next/image";
import { Search, MapPin, ChevronDown } from "lucide-react";
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
    <section className="relative bg-[#F8F8FD] overflow-hidden flex items-center">
      <div className="container mx-auto px-4 md:px-6 pt-16 relative z-10">
        <div className="flex flex-col gap-4 py-16">
          {/* Hero Content */}
          <div className="flex flex-col space-y-8 animate-in slide-in-from-left duration-700">
            <div className="space-y-4">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-clash text-[#2D2D2D] leading-[1.1]">
                  Discover <br /> more than <br />
                  <span className="relative inline-block text-[#26A4FF]">
                    5000+ Jobs
                  </span>
                </h1>
                <div className=" py-2 left-0 w-full">
                  <Image
                    src="/assets/images/underline.png"
                    alt="underline"
                    width={450}
                    height={40}
                    className=""
                  />
                </div>
              </div>
              <p className="text-light text-lg md:text-xl font-epilogue max-w-md leading-relaxed">
                Great platform for the job seeker that searching for new career
                heights and passionate about startups.
              </p>
            </div>
          </div>

          {/* Search Bar Card and Popular tag */}
          <div className="space-y-2 font-epilogue z-50">
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 md:p-3 shadow-2xl shadow-indigo-100/50 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:max-w-3xl"
            >
              <div className="flex-1 flex items-center gap-3 px-4 border-b md:border-b-0 md:border-r border-zinc-100 py-3 md:py-0">
                <Search className="text-[#4640DE] size-5" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-[#2D2D2D] placeholder:text-[#A8ADB7] text-sm md:text-base font-epilogue"
                />
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-0">
                <MapPin className="text-[#4640DE] size-5" />
                <Select onValueChange={(value) => setDistrict(value)} value={district}>
                  <SelectTrigger className="w-full bg-transparent border-none focus:ring-0 px-0 h-auto text-[#2D2D2D] font-epilogue text-sm md:text-base cursor-pointer shadow-none">
                    <SelectValue placeholder="Location (District)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl border-zinc-100 shadow-2xl">
                    {districts.map((district) => (
                      <SelectItem key={district} value={district} className="font-epilogue">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="bg-[#4640DE] hover:bg-[#3b36c0] text-white px-6 py-6 rounded-none font-bold font-epilogue font-display text-base transition-transform active:scale-95 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Search my job
              </Button>
            </form>

            {/* Popular Tags */}
            <div className="flex items-center gap-2 text-sm text-light font-epilogue">
              <span className="">Popular :</span>
              <div className="flex flex-wrap gap-2 font-semibold text-[#2D2D2D]">
                {["UI Designer", "UX Researcher", "Android", "Admin"].map((tag, index, arr) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="hover:text-[#4640DE] transition-colors cursor-pointer"
                  >
                    {tag}{index < arr.length - 1 ? "," : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Visual Assets */}
          <div className="absolute bottom-0 right-0 hidden lg:block animate-in fade-in zoom-in duration-1000">
            {/* Main Hero Image */}
            <div className="relative z-10 flex justify-end items-end pt-10">
              <Image
                src="/assets/images/hero-man.png"
                alt="Job seeker"
                width={450}
                height={620}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {/* Pattern Background */}
      <div className="absolute inset-y-0 right-0 w-215 pointer-events-none">
        <Image
          src="/assets/images/Pattern.svg"
          alt="Background Pattern"
          fill
          className="object-cover object-right"
          priority
        />
      </div>
    </section>
  );
};

export default HeroSection;
