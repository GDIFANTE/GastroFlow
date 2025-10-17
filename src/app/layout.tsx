// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GastroFlow",
  description: "Sistema de controle de pedidos e cardápio",
  icons: {
    icon: "/Logomain.jpeg", // 🔹 Ícone da aba (favicon)
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-50`}>
        {/* 🔸 Cabeçalho */}
        <nav className="sticky top-0 z-10 bg-white border-b shadow-sm">
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            {/* 🔹 Logo + Nome */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/Logomain.jpeg"
                alt="Logo GastroFlow"
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
                GastroFlow
              </span>
            </Link>

            {/* 🔹 Menu de navegação */}
            <div className="flex gap-4 text-sm text-black font-medium">
              <Link
                href="/cardapio"
                className="hover:text-orange-500 transition-colors"
              >
                Cardápio
              </Link>
              <Link
                href="/pedidos"
                className="hover:text-orange-500 transition-colors"
              >
                Pedidos
              </Link>
              <Link
                href="/clientes"
                className="hover:text-orange-500 transition-colors"
              >
                Clientes
              </Link>
            </div>
          </div>
        </nav>

        {/* 🔹 Conteúdo principal */}
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </body>
    </html>
  );
}
