"use client";
import { useEffect } from "react";

export function SessionChecker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (!session || !session.user) {
        const currentPath = window.location.pathname;
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(
          currentPath
        )}`;
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
