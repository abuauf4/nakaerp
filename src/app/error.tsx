"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-4 max-w-md w-full premium-card p-8">
        <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[32px]">warning</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Something went wrong!</h2>
        <div className="p-4 bg-surface-high rounded-lg overflow-auto max-h-40">
          <p className="text-xs text-error font-mono text-left break-words">
            {error.message || "An unexpected application error occurred."}
          </p>
        </div>
        <Button
          onClick={() => reset()}
          className="w-full mt-6 technical-gradient"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
