// app/layout.tsx
import { Work_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ApolloProvider } from "@/components/providers/ApolloProvider";
import { HabitProvider } from "@/contexts/HabitContext";

const workSans = Work_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "TST Coaching - Habit Tracker",
  description: "Track your habits and build positive routines with TST Coaching",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TST Coaching"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "TST Coaching",
    "msapplication-TileColor": "#0D9488"
  }
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#0D9488'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={workSans.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TST Coaching" />
        <meta name="msapplication-TileColor" content="#0D9488" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <ApolloProvider>
          <HabitProvider>
            {children}
          </HabitProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
