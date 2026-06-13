import { OrdersFeed } from "@/features/orders/components/orders-feed";

export function OrdersPageView({ initialDate, initialAvailableDates, initialOrders }) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Операционный поток</p>
          <h2>Отдельная страница для просмотра заказов по датам.</h2>
          <p className="hero-text">
            Здесь вся выдача собрана в одном месте: видно клиентов, слот самовывоза и состав заказа.
          </p>
        </div>
      </section>
      <OrdersFeed
        initialDate={initialDate}
        initialAvailableDates={initialAvailableDates}
        initialOrders={initialOrders}
      />
    </>
  );
}
