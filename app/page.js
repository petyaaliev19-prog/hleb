import { AppShell } from "@/components/app-shell";
import { HeroSection } from "@/components/hero-section";
import { StorefrontWorkspace } from "@/features/bakeries/components/storefront-workspace";
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel";
import { OrdersFeed } from "@/features/orders/components/orders-feed";
import { dbRepository } from "@/server/db/db-repository";

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
      <OrdersFeed
        initialDate={metrics.primaryDate}
        initialAvailableDates={availableDates}
        initialOrders={initialOrders}
      />
      <DashboardPanel
        initialDate={metrics.primaryDate}
        initialBakeries={bakeries}
        initialAvailableDates={availableDates}
        initialOrders={initialDashboardOrders}
      />
    </AppShell>
  );
}
