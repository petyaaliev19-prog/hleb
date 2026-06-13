import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OwnerBakeryPageView } from "@/features/owner/components/owner-bakery-page-view";
import { dbRepository } from "@/server/db/db-repository";

export default async function OwnerBakeryPage({ params }) {
  const { slug } = await params;
  const bakery = await dbRepository.getBakeryBySlug(slug);

  if (!bakery) {
    notFound();
  }

  const metrics = await dbRepository.getOverviewMetrics();
  const bakeries = await dbRepository.getBakeries();
  const availableDates = await dbRepository.getAvailableDates();
  const initialOrders = await dbRepository.getOrders({
    date: metrics.primaryDate,
    bakeryId: bakery.id,
  });

  return (
    <AppShell activeNav="owner" audience="owner">
      <OwnerBakeryPageView
        bakery={bakery}
        allBakeries={bakeries}
        initialDate={metrics.primaryDate}
        initialAvailableDates={availableDates}
        initialOrders={initialOrders}
      />
    </AppShell>
  );
}
