import Link from "next/link";

const navItemsByAudience = {
  customer: [
    { href: "/", label: "Пекарни", key: "bakeries" },
    { href: "/owner", label: "Для пекарен", key: "owner" },
  ],
  owner: [
    { href: "/owner", label: "Мои пекарни", key: "owner" },
    { href: "/owner/orders", label: "Заказы", key: "orders" },
  ],
};

export function AppShell({ activeNav, audience = "customer", children }) {
  const navItems = navItemsByAudience[audience] ?? navItemsByAudience.customer;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div>
          <p className="eyebrow">{audience === "owner" ? "Кабинет пекарни" : "Сервис предзаказа"}</p>
          <h1>Хлебушек</h1>
        </div>
        <nav className="topnav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link
              key={item.key}
              className={`nav-link ${activeNav === item.key ? "is-active" : ""}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="page-stack">{children}</main>
    </div>
  );
}
