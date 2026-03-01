import CategorySection from "@/components/Home/CategorySection";
import FeaturedJobs from "@/components/Home/FeaturedJobs";
import HeroSection from "@/components/Home/HeroSection";
import LatestJob from "@/components/Home/LatestJob";
import PartnerCompany from "@/components/Home/PartnerCompany";
import Poster from "@/components/Home/Poster";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <PartnerCompany />
      <CategorySection />
      <Poster />
      <FeaturedJobs />
      <LatestJob />
    </div>
  );
}
