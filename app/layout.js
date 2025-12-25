import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata = {
  title: "RoleDeck Pro | Real-Time Tracker",
  description: "Advanced resume tracking and analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}