import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baselyne – Service Business OS",
  description: "Freeze Chaos. Heat Results. The multi-org operations platform for service businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
