"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { heroSchema, type HeroInput } from "@/lib/schemas/content";
import { updateHeroAction } from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFeedback } from "@/components/admin/FormFeedback";
import type { Database } from "@/lib/supabase/database.types";

type Hero = Database["public"]["Tables"]["hero_content"]["Row"];

export function HeroForm({ hero }: { hero: Hero | null }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeroInput>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      headline: hero?.headline ?? "",
      subheadline: hero?.subheadline ?? "",
      claim: hero?.claim ?? "",
      disclaimer: hero?.disclaimer ?? "",
      primary_cta_label:
        hero?.primary_cta_label ?? "Quiero formar parte del cambio",
      secondary_cta_label:
        hero?.secondary_cta_label ?? "Conoce su trayectoria",
      image_url: hero?.image_url ?? "",
    },
  });

  const onSubmit = (values: HeroInput) => {
    setStatus("idle");
    startTransition(async () => {
      const result = await updateHeroAction(values);
      if (result.ok) {
        setStatus("success");
        setMessage("Cambios guardados.");
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8"
    >
      <Field label="Titular" error={errors.headline?.message}>
        <Input {...register("headline")} />
      </Field>
      <Field label="Subtítulo" error={errors.subheadline?.message}>
        <Textarea rows={2} {...register("subheadline")} />
      </Field>
      <Field label="Claim principal" error={errors.claim?.message}>
        <Input {...register("claim")} />
      </Field>
      <Field label="Disclaimer" error={errors.disclaimer?.message}>
        <Textarea rows={2} {...register("disclaimer")} />
      </Field>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="CTA primario"
          error={errors.primary_cta_label?.message}
        >
          <Input {...register("primary_cta_label")} />
        </Field>
        <Field
          label="CTA secundario"
          error={errors.secondary_cta_label?.message}
        >
          <Input {...register("secondary_cta_label")} />
        </Field>
      </div>
      <Field
        label="URL de imagen (opcional)"
        error={errors.image_url?.message}
        hint="Usaremos un placeholder si no hay imagen."
      >
        <Input type="url" {...register("image_url")} />
      </Field>

      <FormFeedback status={status} message={message} />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
