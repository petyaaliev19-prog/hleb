import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SingleBakeryPage } from "@/components/single-bakery-page";
import { dbRepository } from "@/lib/db-repository";

export default async function BakeryPage({ params }) {
  const { slug } = await params;
  const bakery = await dbRepository.getBakeryBySlug(slug);

  if (!bakery) {
    notFound();
  }

  return (
    <AppShell activeNav="showcase">
      <SingleBakeryPage slug={slug} initialBakery={bakery} />
    </AppShell>
  );
}
