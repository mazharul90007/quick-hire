"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const PartnerCompany = () => {
  const companies = [
    { name: "Adidas", logo: "/assets/images/partner-logo/adidas.png" },
    { name: "Bikroy", logo: "/assets/images/partner-logo/bikroy.png" },
    { name: "Nike", logo: "/assets/images/partner-logo/nike.png" },
    { name: "AMD", logo: "/assets/images/partner-logo/amd.png" },
    { name: "Intel", logo: "/assets/images/partner-logo/intel.png" },
    { name: "RFL", logo: "/assets/images/partner-logo/rfl.png" },
  ];

  return (
    <section className="py-16 bg-background overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-start gap-10">
          <div className="flex-none">
            <p className="text-muted-foreground font-epilogue text-lg md:text-xl whitespace-nowrap opacity-60">
              Companies we helped grow
            </p>
          </div>

          <div className="relative w-full">
            {/* Gradient Overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="flex items-center"
            >
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="mx-10 md:mx-16 flex items-center justify-center grayscale transition-all duration-500 cursor-pointer opacity-40 hover:opacity-100 hover:grayscale-0"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={160}
                    height={60}
                    className="h-8 md:h-10 w-auto object-contain"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCompany;
