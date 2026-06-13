import { AppShell } from "@/components/app-shell";
import { OrdersPageView } from "@/components/orders-page-view";
import { dbRepository } from "@/lib/db-repository";

export default async function OrdersPage() {
  const metrics = await dbRepository.getOverviewMetrics();

  return (
    <AppShell activeNav="orders">
      <OrdersPageView
        initialDate={metrics.primaryDate}
        initialOrders={await dbRepository.getOrders({ date: metrics.primaryDate })}
      />
    </AppShell>
  );
}
