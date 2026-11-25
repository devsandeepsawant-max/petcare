import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawsome Grooming Studio | Professional Dog Grooming & Spa",
  description:
    "Because Every Dog Deserves a Little Extra Care. Professional dog grooming, baths, deshedding and spa treatments for all breeds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream-100 text-charcoal-900 selection:bg-forest-100 selection:text-forest-900">
        {children}
      </body>
    </html>
  );
}
