import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const passengerSans = localFont({
  src: [
    { path: "./fonts/PassengerSans-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/PassengerSans-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/PassengerSans-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/PassengerSans-Semibold.otf", weight: "600", style: "normal" },
    { path: "./fonts/PassengerSans-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-passenger",
});

const gtAlpina = localFont({
  src: [
    { path: "./fonts/GT-Alpina-Standard-Light-Trial.otf", weight: "300", style: "normal" },
    { path: "./fonts/GT-Alpina-Standard-Regular-Trial.otf", weight: "400", style: "normal" },
    { path: "./fonts/GT-Alpina-Standard-Medium-Trial.otf", weight: "500", style: "normal" },
    { path: "./fonts/GT-Alpina-Standard-Bold-Trial.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-alpina",
});

export const metadata: Metadata = {
  title: "Plum | Intelligent Claims",
  description: "AI-powered, explainable health insurance claims processing.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1", // Prevents auto-zoom on mobile inputs
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${passengerSans.variable} ${gtAlpina.variable} antialiased min-h-screen flex flex-col relative`}>
        {/* Subtle glowing ambient orbs using Plum's exact colors */}
        <div className="fixed top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-plum-pink/10 blur-[100px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-plum-secondary/30 blur-[100px] pointer-events-none -z-10" />
        
        {/* Navbar */}
        <nav className="w-full border-b border-plum-secondary/50 bg-plum-main/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-plum-offwhite flex items-center gap-2">
              <span className="text-plum-pink">plum</span> 
              <span className="text-plum-muted text-sm sm:text-lg font-sans font-normal ml-2 tracking-normal border-l border-plum-secondary pl-3 sm:pl-4">
                Claims Intelligence
              </span>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}