"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="section-eyebrow">Unexpected error</p>
      <h1 className="section-title text-[clamp(2.6rem,5vw,4.8rem)]">
        Something went wrong while loading this page.
      </h1>
      <p className="section-copy max-w-2xl">
        The error was handled safely, and you can try the request again.
      </p>
      <Button size="lg" variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
