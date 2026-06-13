import { DashboardPanel } from "@/components/dashboard-panel";

export function DashboardPageView({ initialDate, initialBakeries, initialAvailableDates, initialOrders }) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Панель пекарни</p>
          <h2>Производственная сводка и выдача на день в одном экране.</h2>
          <p className="hero-text">
            Это MVP-операционка для пекарни: понять, сколько чего печь и кто когда заберет заказ.
          </p>
        </div>
      </section>
      <DashboardPanel
        initialDate={initialDate}
        initialBakeries={initialBakeries}
        initialAvailableDates={initialAvailableDates}
        initialOrders={initialOrders}
      />
    </>
  );
}
