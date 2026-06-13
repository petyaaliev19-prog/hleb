import { AppShell } from "@/components/app-shell";
import { OrdersPageView } from "@/features/orders/components/orders-page-view";
import { dbRepository } from "@/server/db/db-repository";

export default async function OwnerOrdersPage() {
  const metrics = await dbRepository.getOverviewMetrics();
  const availableDates = await dbRepository.getAvailableDates();

  return (
    <AppShell activeNav="orders" audience="owner">
      <OrdersPageView
        initialDate={metrics.primaryDate}
        initialAvailableDates={availableDates}
        initialOrders={await dbRepository.getOrders({ date: metrics.primaryDate })}
      />
    </AppShell>
  );
}
