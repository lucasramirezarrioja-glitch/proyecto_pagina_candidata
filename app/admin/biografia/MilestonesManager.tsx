"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  milestoneSchema,
  type MilestoneInput,
} from "@/lib/schemas/content";
import {
  deleteMilestoneAction,
  upsertMilestoneAction,
} from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormFeedback } from "@/components/admin/FormFeedback";
import type { Database } from "@/lib/supabase/database.types";

type Milestone = Database["public"]["Tables"]["milestones"]["Row"];

export function MilestonesManager({
  milestones,
}: {
  milestones: Milestone[];
}) {
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {milestones.length} hito{milestones.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo hito
        </Button>
      </div>

      <div className="grid gap-3">
        {milestones.map((m) => (
          <article
            key={m.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {m.year} · orden {m.order_index}
                {m.is_published ? "" : " · borrador"}
              </p>
              <h3 className="font-semibold">{m.title}</h3>
              {m.description ? (
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  {m.description}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(m);
                  setCreating(false);
                }}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Editar
              </Button>
              <DeleteMilestoneButton id={m.id} />
            </div>
          </article>
        ))}
        {milestones.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aún no hay hitos en la línea de tiempo.
          </p>
        ) : null}
      </div>

      <Dialog
        open={creating || editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar hito" : "Nuevo hito"}</DialogTitle>
          </DialogHeader>
          {(creating || editing) && (
            <MilestoneForm
              initial={editing}
              nextOrder={Math.max(0, ...milestones.map((m) => m.order_index)) + 1}
              onClose={() => {
                setCreating(false);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeleteMilestoneButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este hito?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borrará de forma permanente. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() =>
              startTransition(async () => {
                await deleteMilestoneAction(id);
              })
            }
          >
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MilestoneForm({
  initial,
  nextOrder,
  onClose,
}: {
  initial: Milestone | null;
  nextOrder: number;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MilestoneInput>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: initial
      ? {
          id: initial.id,
          year: initial.year,
          title: initial.title,
          description: initial.description ?? "",
          order_index: initial.order_index,
          is_published: initial.is_published,
        }
      : {
          year: new Date().getFullYear(),
          title: "",
          description: "",
          order_index: nextOrder,
          is_published: true,
        },
  });

  const published = watch("is_published");

  const onSubmit = (values: MilestoneInput) => {
    startTransition(async () => {
      const result = await upsertMilestoneAction(values);
      if (result.ok) {
        setStatus("success");
        setMessage("Cambios guardados.");
        setTimeout(onClose, 600);
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-6"
    >
      <h3 className="font-display text-lg font-semibold">
        {initial ? "Editar hito" : "Nuevo hito"}
      </h3>
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <Label>Año</Label>
          <Input
            type="number"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year?.message ? (
            <p className="mt-1 text-xs text-destructive">{errors.year.message}</p>
          ) : null}
        </div>
        <div className="lg:col-span-2">
          <Label>Título</Label>
          <Input {...register("title")} />
          {errors.title?.message ? (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>
      </div>
      <div>
        <Label>Descripción (opcional)</Label>
        <Textarea rows={3} {...register("description")} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
        <div>
          <Label>Orden</Label>
          <Input
            type="number"
            min={0}
            {...register("order_index", { valueAsNumber: true })}
          />
        </div>
        <div className="flex items-center gap-3 lg:mt-6">
          <Switch
            id="milestone-published"
            checked={!!published}
            onCheckedChange={(v) => setValue("is_published", v)}
          />
          <Label htmlFor="milestone-published" className="m-0 cursor-pointer">
            Publicar
          </Label>
        </div>
      </div>
      <FormFeedback status={status} message={message} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
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
