import { AppShell } from "@/components/app-shell";
import { OwnerHomeView } from "@/features/owner/components/owner-home-view";
import { dbRepository } from "@/server/db/db-repository";

export default async function OwnerPage() {
  const bakeries = await dbRepository.getBakeries();

  return (
    <AppShell activeNav="owner" audience="owner">
      <OwnerHomeView bakeries={bakeries} />
    </AppShell>
  );
}
