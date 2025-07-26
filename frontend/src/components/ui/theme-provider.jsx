"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show a loading state that matches your app's background to prevent flash
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      storageKey="codeon-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}