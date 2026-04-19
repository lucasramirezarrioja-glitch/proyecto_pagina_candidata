"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

export function FormFeedback({
  status,
  message,
}: {
  status: "idle" | "success" | "error";
  message?: string | null;
}) {
  if (status === "idle" || !message) return null;
  const isSuccess = status === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        isSuccess
          ? "flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary"
          : "flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
