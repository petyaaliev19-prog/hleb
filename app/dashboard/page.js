import { AppShell } from "@/components/app-shell";
import { DashboardPageView } from "@/components/dashboard-page-view";
import { dbRepository } from "@/lib/db-repository";

export default async function DashboardPage() {
  const metrics = await dbRepository.getOverviewMetrics();
  const bakeries = await dbRepository.getBakeries();
  const availableDates = await dbRepository.getAvailableDates();
  const initialBakeryId = bakeries[0]?.id;
  const initialOrders = initialBakeryId
    ? await dbRepository.getOrders({ date: metrics.primaryDate, bakeryId: initialBakeryId })
    : [];

  return (
    <AppShell activeNav="dashboard">
      <DashboardPageView
        initialDate={metrics.primaryDate}
        initialBakeries={bakeries}
        initialAvailableDates={availableDates}
        initialOrders={initialOrders}
      />
    </AppShell>
  );
}
