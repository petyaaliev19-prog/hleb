import { AppShell } from "@/components/app-shell";
import { HeroSection } from "@/components/hero-section";
import { PublicBakeryCatalog } from "@/features/bakeries/components/public-bakery-catalog";
import { dbRepository } from "@/server/db/db-repository";

export default async function HomePage() {
  const metrics = await dbRepository.getOverviewMetrics();
  const bakeries = await dbRepository.getBakeries();

  return (
    <AppShell activeNav="bakeries">
      <HeroSection initialMetrics={metrics} />
      <PublicBakeryCatalog initialBakeries={bakeries} />
    </AppShell>
  );
}
