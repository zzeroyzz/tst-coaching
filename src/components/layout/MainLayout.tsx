// components/layout/MainLayout.tsx
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-nb-lilac/40 flex flex-col">
      <Navigation />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
