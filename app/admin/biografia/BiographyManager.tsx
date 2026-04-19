"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  biographySectionSchema,
  type BiographySectionInput,
} from "@/lib/schemas/content";
import {
  deleteBiographySectionAction,
  upsertBiographySectionAction,
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

type Section = Database["public"]["Tables"]["biography_sections"]["Row"];

export function BiographyManager({ sections }: { sections: Section[] }) {
  const [editing, setEditing] = useState<Section | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {sections.length} bloque{sections.length === 1 ? "" : "s"}
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
          Nuevo bloque
        </Button>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <article
            key={section.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Orden {section.order_index}
                  {section.is_published ? " · publicado" : " · borrador"}
                </p>
                <h3 className="font-display text-lg font-semibold">
                  {section.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(section);
                    setCreating(false);
                  }}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Editar
                </Button>
                <DeleteSectionButton id={section.id} />
              </div>
            </div>
            <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
              {section.body}
            </p>
          </article>
        ))}
        {sections.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aún no hay bloques. Crea el primero para contar la historia.
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
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar bloque" : "Nuevo bloque"}</DialogTitle>
          </DialogHeader>
          {(creating || editing) && (
            <BiographyForm
              initial={editing}
              nextOrder={Math.max(0, ...sections.map((s) => s.order_index)) + 1}
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

function DeleteSectionButton({ id }: { id: string }) {
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
          <AlertDialogTitle>¿Eliminar este bloque?</AlertDialogTitle>
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
                await deleteBiographySectionAction(id);
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

function BiographyForm({
  initial,
  nextOrder,
  onClose,
}: {
  initial: Section | null;
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
  } = useForm<BiographySectionInput>({
    resolver: zodResolver(biographySectionSchema),
    defaultValues: initial
      ? {
          id: initial.id,
          order_index: initial.order_index,
          title: initial.title,
          body: initial.body,
          is_published: initial.is_published,
        }
      : {
          order_index: nextOrder,
          title: "",
          body: "",
          is_published: true,
        },
  });

  const onSubmit = (values: BiographySectionInput) => {
    startTransition(async () => {
      const result = await upsertBiographySectionAction(values);
      if (result.ok) {
        setStatus("success");
        setMessage("Cambios guardados.");
        setTimeout(() => onClose(), 600);
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    });
  };

  const published = watch("is_published");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-6"
    >
      <h3 className="font-display text-lg font-semibold">
        {initial ? "Editar bloque" : "Nuevo bloque"}
      </h3>
      <div className="grid gap-4 lg:grid-cols-[1fr_120px]">
        <div>
          <Label>Título</Label>
          <Input {...register("title")} />
          {errors.title?.message ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.title.message}
            </p>
          ) : null}
        </div>
        <div>
          <Label>Orden</Label>
          <Input
            type="number"
            min={0}
            {...register("order_index", { valueAsNumber: true })}
          />
        </div>
      </div>
      <div>
        <Label>Contenido</Label>
        <Textarea rows={8} {...register("body")} />
        {errors.body?.message ? (
          <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="bio-published"
          checked={!!published}
          onCheckedChange={(v) => setValue("is_published", v)}
        />
        <Label htmlFor="bio-published" className="m-0 cursor-pointer">
          Publicar en la landing
        </Label>
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
