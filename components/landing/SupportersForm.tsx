"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  supporterSchema,
  type SupporterInput,
} from "@/lib/schemas/supporter";
import { submitSupporter } from "@/app/actions/supporters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrivacyNotice } from "@/components/site/privacy/PrivacyNotice";
import { MunicipalityCombobox } from "@/components/site/sumate/MunicipalityCombobox";
import { cn } from "@/lib/utils";

export function SupportersForm({
  introText,
  successText,
  privacyMarkdown,
}: {
  introText: string;
  successText: string;
  privacyMarkdown: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [validationHint, setValidationHint] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<SupporterInput>({
    resolver: zodResolver(supporterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      municipality: "",
      phone: "",
      consent_accepted: false as unknown as true,
      website: "",
    },
    mode: "onBlur",
  });

  const role = watch("role");
  const consent = watch("consent_accepted");

  const acceptPrivacy = () => {
    setValue("consent_accepted", true as unknown as true, {
      shouldValidate: true,
    });
    setPrivacyOpen(false);
  };

  const onSubmit = (values: SupporterInput) => {
    setValidationHint(null);
    setServerError(null);
    startTransition(async () => {
      const result = await submitSupporter(values);
      if (result.ok) {
        setSuccess(true);
        reset();
      } else {
        setServerError(result.error);
      }
    });
  };

  const onInvalid = (formErrors: FieldErrors<SupporterInput>) => {
    const parts: string[] = [];
    if (formErrors.full_name) parts.push("nombre completo");
    if (formErrors.email) parts.push("correo electrónico");
    if (formErrors.municipality) parts.push("municipio de la lista");
    if (formErrors.role) parts.push("cómo quieres participar");
    if (formErrors.consent_accepted) parts.push("aceptar el aviso de privacidad");
    if (formErrors.phone) parts.push("teléfono válido o déjalo vacío");
    setValidationHint(
      parts.length > 0
        ? `Falta completar o corregir: ${parts.join(", ")}.`
        : "Revisa los campos marcados antes de enviar.",
    );
  };

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center"
      >
        <CheckCircle2
          className="mx-auto h-10 w-10 text-primary"
          aria-hidden="true"
        />
        <h3 className="mt-4 font-display text-2xl font-semibold text-primary">
          ¡Gracias por sumarte!
        </h3>
        <p className="mt-2 text-base text-muted-foreground">{successText}</p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Registrar otra persona
        </Button>
      </div>
    );
  }

  return (
    <>
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="flex max-h-[min(88vh,800px)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 space-y-1.5 px-6 pb-2 pt-6">
            <DialogTitle>Aviso de privacidad</DialogTitle>
            <DialogDescription>
              Lee el siguiente texto. Para registrarte debes pulsar{" "}
              <span className="font-medium text-foreground">Aceptar</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto border-y border-border px-6 py-4">
            <PrivacyNotice source={privacyMarkdown} compact showTitle={false} />
          </div>
          <DialogFooter className="shrink-0 flex-col gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-between">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/aviso-privacidad" target="_blank" rel="noopener">
                Ver en página completa
              </Link>
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={acceptPrivacy}
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form
        noValidate
               onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-2"
        aria-describedby="form-intro"
      >
        <p
          id="form-intro"
          className="text-sm text-muted-foreground lg:col-span-2"
        >
          {introText}
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label>
            No llenar
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </label>
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="full_name">
            Nombre completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="full_name"
            autoComplete="name"
            aria-invalid={!!errors.full_name}
            aria-describedby={errors.full_name ? "err-full_name" : undefined}
            {...register("full_name")}
          />
          {errors.full_name ? (
            <p
              id="err-full_name"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.full_name.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="email">
            Correo electrónico <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p
              id="err-email"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="municipality">
            Municipio <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="municipality"
            control={control}
            render={({ field }) => (
              <MunicipalityCombobox
                id="municipality"
                value={field.value ?? ""}
                onChange={field.onChange}
                ariaInvalid={!!errors.municipality}
                ariaDescribedBy={
                  errors.municipality ? "err-municipality" : undefined
                }
              />
            )}
          />
          {errors.municipality ? (
            <p
              id="err-municipality"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.municipality.message}
            </p>
          ) : null}
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Ej. 747 123 4567"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "err-phone" : undefined}
            {...register("phone")}
          />
          {errors.phone ? (
            <p
              id="err-phone"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        <fieldset className="lg:col-span-2">
          <legend className="mb-3 text-sm font-medium">
            ¿Cómo quieres participar?{" "}
            <span className="text-destructive">*</span>
          </legend>
          <RadioGroup
            value={role}
            onValueChange={(value) =>
              setValue("role", value as "seguidor" | "activista", {
                shouldValidate: true,
              })
            }
            className="grid gap-3 sm:grid-cols-2"
          >
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 transition-colors",
                role === "seguidor" && "border-primary bg-primary/5",
              )}
            >
              <RadioGroupItem value="seguidor" id="role-seguidor" />
              <span className="flex flex-col">
                <span className="font-semibold text-foreground">
                  Registrarme como seguidor
                </span>
                <span className="text-xs text-muted-foreground">
                  Recibiré noticias y novedades del proyecto.
                </span>
              </span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 transition-colors",
                role === "activista" && "border-primary bg-primary/5",
              )}
            >
              <RadioGroupItem value="activista" id="role-activista" />
              <span className="flex flex-col">
                <span className="font-semibold text-foreground">
                  Registrarme como activista
                </span>
                <span className="text-xs text-muted-foreground">
                  Quiero apoyar en actividades y eventos ciudadanos.
                </span>
              </span>
            </label>
          </RadioGroup>
          {errors.role ? (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {errors.role.message}
            </p>
          ) : null}
        </fieldset>

        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 lg:col-span-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={!!consent}
              onCheckedChange={(checked) => {
                if (checked === true) {
                  setPrivacyOpen(true);
                  return;
                }
                setValue("consent_accepted", false as unknown as true, {
                  shouldValidate: true,
                });
              }}
              aria-describedby="consent-desc"
            />
            <div className="min-w-0 flex-1 text-sm">
              <Label
                htmlFor="consent"
                className="cursor-pointer text-sm font-medium leading-snug"
              >
                Acepto recibir comunicaciones y el tratamiento de mis datos
                conforme al aviso de privacidad.
              </Label>
              <p id="consent-desc" className="mt-2 text-xs text-muted-foreground">
                Para marcar esta casilla debes leer el aviso y pulsar{" "}
                <span className="font-medium text-foreground">Aceptar</span> en
                la ventana. También puedes{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline underline-offset-2 hover:no-underline"
                  onClick={() => setPrivacyOpen(true)}
                >
                  abrir el aviso de privacidad
                </button>
                .
              </p>
              {errors.consent_accepted ? (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {errors.consent_accepted.message as string}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {validationHint ? (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm text-amber-950 dark:text-amber-100 lg:col-span-2"
          >
            {validationHint}
          </p>
        ) : null}

        {serverError ? (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive lg:col-span-2"
          >
            {serverError}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            Al enviar declaras que la información es veraz y aceptas nuestra
            política de datos.
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full lg:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Registrando…
              </>
            ) : (
              "Registrarme"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
