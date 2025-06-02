import type React from "react";
import "./globals.css";

export const metadata = {
  title: "ETF交易系统",
  description: "先进的ETF交易系统，支持策略开发和回测",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"dark"}>{children}</body>
    </html>
  );
}
