import Image from "next/image";

const PartnerCompany = () => {
  const companies = [
    { name: "Vodafone", logo: "/assets/images/partner-logo/vodafone-logo.svg" },
    { name: "Intel", logo: "/assets/images/partner-logo/intel.svg" },
    { name: "Tesla", logo: "/assets/images/partner-logo/tesla.svg" },
    { name: "AMD", logo: "/assets/images/partner-logo/amd-logo-1.svg" },
    { name: "Talkit", logo: "/assets/images/partner-logo/talkit 1.svg" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-start gap-8 lg:gap-12">
          <div className="flex-none">
            <p className="text-light font-epilogue text-lg md:text-xl whitespace-nowrap opacity-50">
              Companies we helped grow
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between w-full grayscale opacity-60 gap-y-8">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center px-4"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={140}
                  height={40}
                  className="h-6 md:h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCompany;
