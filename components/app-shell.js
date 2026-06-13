import Link from "next/link";

const navItems = [
  { href: "/", label: "Витрина", key: "showcase" },
  { href: "/orders", label: "Заказы", key: "orders" },
  { href: "/dashboard", label: "Панель пекарни", key: "dashboard" },
];

export function AppShell({ activeNav, children }) {
  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div>
          <p className="eyebrow">MVP сервиса предзаказа</p>
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
