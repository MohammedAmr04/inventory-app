"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Something went wrong"
      message={error.message}
      onRetry={reset}
    />
  );
}
