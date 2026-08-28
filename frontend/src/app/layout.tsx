import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "@/components/protected-route";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillGraph AI | Dynamic Competency Mapping",
  description: "AI-Enabled Skill Intelligence platform leveraging Agentic RAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ProtectedRoute>
          {children}
        </ProtectedRoute>
          <Toaster position="top-right" theme="system" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}