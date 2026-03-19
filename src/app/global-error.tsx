"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "1.5rem",
            padding: "5rem 1rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Critical error
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: 0 }}>
            Something went wrong at the application level.
          </h1>
          <p style={{ maxWidth: "36rem", color: "#6b7280" }}>
            The error was handled safely. You can try refreshing the page or
            clicking the button below to recover.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              background: "#111827",
              color: "#fff",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
