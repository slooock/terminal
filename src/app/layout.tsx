import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kayque Avelar",
  description: "Personal website of Kayque",
  openGraph: {
    title: "Kayque Avelar",
    description: "Personal website of Kayque",
    url: "https://kayque.com.br", // Placeholder, user should update
    siteName: "Kayque Avelar",
    images: [
      {
        url: "https://kayque.site/purple.svg", // Placeholder, user should update with actual domain and logo path
        width: 800,
        height: 600,
        alt: "Kayque Site Logo",
      },
    ],
    locale: "pt_BR", // Assuming user's locale is pt_BR
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
