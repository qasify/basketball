"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // Keep list/detail data fresh enough for navigation while avoiding frequent refetches.
          queries: {
            // 5 minutes
            staleTime: 5 * 60 * 1000,
            // 30 minutes
            gcTime: 30 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
