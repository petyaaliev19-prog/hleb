import { AppShell } from "@/components/app-shell";
import { DashboardPanel } from "@/components/dashboard-panel";
import { HeroSection } from "@/components/hero-section";
import { OrdersFeed } from "@/components/orders-feed";
import { StorefrontWorkspace } from "@/components/storefront-workspace";
import { dbRepository } from "@/lib/db-repository";

export default async function HomePage() {
  const metrics = await dbRepository.getOverviewMetrics();
  const bakeries = await dbRepository.getBakeries();
  const availableDates = await dbRepository.getAvailableDates();
  const initialOrders = await dbRepository.getOrders({ date: metrics.primaryDate });
  const initialDashboardBakeryId = bakeries[0]?.id;
  const initialDashboardOrders = initialDashboardBakeryId
    ? await dbRepository.getOrders({ date: metrics.primaryDate, bakeryId: initialDashboardBakeryId })
    : [];

  return (
    <AppShell activeNav="showcase">
      <HeroSection initialMetrics={metrics} />
      <StorefrontWorkspace initialBakeries={bakeries} />
      <OrdersFeed initialDate={metrics.primaryDate} initialOrders={initialOrders} />
      <DashboardPanel
        initialDate={metrics.primaryDate}
        initialBakeries={bakeries}
        initialAvailableDates={availableDates}
        initialOrders={initialDashboardOrders}
      />
    </AppShell>
  );
}
