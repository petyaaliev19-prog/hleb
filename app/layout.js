import "./globals.css";

export const metadata = {
  title: "Хлебушек",
  description: "Сервис предзаказа свежего хлеба с самовывозом и оплатой на месте.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
