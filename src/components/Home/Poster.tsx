import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Poster = () => {
  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative min-h-112.5 overflow-hidden flex flex-col lg:flex-row items-center">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/assets/images/poster/rectangle.png"
              alt="background pattern"
              fill
              className="object-cover"
            />
          </div>

          {/* Left Content */}
          <div className="relative z-20 w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col items-start text-left space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-clash text-white leading-tight">
              Start posting <br /> jobs today
            </h2>
            <p className="text-white/80 font-epilogue text-medium md:text-base font-medium">
              Start posting jobs for only $10.
            </p>
            <Button
              asChild
              className="bg-white text-[#4640DE] hover:bg-zinc-100 px-8 py-6 text-lg font-bold rounded-none font-epilogue border-none transition-all shadow-lg"
            >
              <Link href="/signup">Sign Up For Free</Link>
            </Button>
          </div>

          {/* Right Image Container - Pinned to bottom right */}
          <div className="relative lg:absolute bottom-0 right-0 z-10 w-full lg:w-auto flex justify-end items-end lg:pr-20">
            <Image
              src="/assets/images/poster/dashboard.svg"
              alt="Dashboard overview"
              width={560}
              height={345}
              className="object-contain align-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Poster;
