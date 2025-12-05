//src/pages/HomePage.tsx

import BannerCarousel from "../components/landing/BannerCarousel";
import TopProducts from "../components/landing/TopProducts";
import CatalogSection from "../components/landing/CatalogSection";
import { HomeRecommendations } from "../components/recommendations/HomeRecommendations";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <BannerCarousel />
      <TopProducts />
      <CatalogSection />
      <HomeRecommendations /> 
    </section>
  );
}

