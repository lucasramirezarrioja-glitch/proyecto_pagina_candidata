"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { upsertSettingAction } from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFeedback } from "@/components/admin/FormFeedback";

type SettingFieldConfig = {
  key: string;
  label: string;
  description?: string;
  type: "input" | "textarea" | "markdown";
  initial: string;
};

export function SettingsManager({ fields }: { fields: SettingFieldConfig[] }) {
  return (
    <div className="grid gap-6">
      {fields.map((f) => (
        <SettingCard key={f.key} config={f} />
      ))}
    </div>
  );
}

function SettingCard({ config }: { config: SettingFieldConfig }) {
  const [value, setValue] = useState(config.initial);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await upsertSettingAction({
        key: config.key,
        value,
      });
      if (result.ok) {
        setStatus("success");
        setMessage("Guardado.");
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4">
        <Label htmlFor={config.key}>{config.label}</Label>
        {config.description ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {config.description}
          </p>
        ) : null}
      </div>
      {config.type === "input" ? (
        <Input
          id={config.key}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <Textarea
          id={config.key}
          rows={config.type === "markdown" ? 12 : 4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={config.type === "markdown" ? "font-mono text-xs" : undefined}
        />
      )}
      <div className="mt-4 flex items-center justify-between gap-4">
        <FormFeedback status={status} message={message} />
        <Button type="submit" disabled={isPending} className="ml-auto">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}
