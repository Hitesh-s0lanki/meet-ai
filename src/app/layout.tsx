import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet AI",
  description:
    "An intelligent assistant built to simplify your tasks and enhance productivity.",
  icons: ["/logo.svg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </TRPCReactProvider>
  );
}
