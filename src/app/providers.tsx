"use client";

import { UserProvider } from "@/contexts/user-context";
import { Toaster } from "sonner";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UserProvider>
      {children}
      <Toaster position="bottom-right" richColors />
    </UserProvider>
  );
}
