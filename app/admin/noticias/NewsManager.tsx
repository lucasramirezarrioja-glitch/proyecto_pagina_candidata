"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import { newsItemSchema, type NewsItemInput } from "@/lib/schemas/content";
import { deleteNewsAction, upsertNewsAction } from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

type NewsItem = Database["public"]["Tables"]["news_items"]["Row"];

const TYPE_LABEL: Record<string, string> = {
  social: "Redes sociales",
  medio: "Medios",
  evento: "Evento",
};

export function NewsManager({ items }: { items: NewsItem[] }) {
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {items.length} nota{items.length === 1 ? "" : "s"}
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
          Nueva nota
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{TYPE_LABEL[item.type] ?? item.type}</Badge>
                {item.is_pinned ? (
                  <Badge variant="gold">
                    <Pin className="h-3 w-3" aria-hidden="true" />
                    Destacada
                  </Badge>
                ) : null}
                {!item.is_published ? <Badge variant="muted">Borrador</Badge> : null}
                <span>{new Date(item.published_at).toLocaleDateString("es-MX")}</span>
              </div>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {item.summary}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(item);
                  setCreating(false);
                }}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Editar
              </Button>
              <DeleteNewsButton id={item.id} />
            </div>
          </article>
        ))}
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aún no hay noticias. Crea la primera para mantener al equipo informado.
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
            <DialogTitle>{editing ? "Editar nota" : "Nueva nota"}</DialogTitle>
          </DialogHeader>
          {(creating || editing) && (
            <NewsForm
              initial={editing}
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

function DeleteNewsButton({ id }: { id: string }) {
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
          <AlertDialogTitle>¿Eliminar esta nota?</AlertDialogTitle>
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
                await deleteNewsAction(id);
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

function toDateTimeLocal(value: string) {
  const d = new Date(value);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

function NewsForm({
  initial,
  onClose,
}: {
  initial: NewsItem | null;
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
  } = useForm<NewsItemInput>({
    resolver: zodResolver(newsItemSchema),
    defaultValues: initial
      ? {
          id: initial.id,
          title: initial.title,
          summary: initial.summary,
          source_name: initial.source_name ?? "",
          source_url: initial.source_url ?? "",
          image_url: initial.image_url ?? "",
          published_at: toDateTimeLocal(initial.published_at),
          type: initial.type as NewsItemInput["type"],
          is_pinned: initial.is_pinned,
          is_published: initial.is_published,
        }
      : {
          title: "",
          summary: "",
          source_name: "",
          source_url: "",
          image_url: "",
          published_at: toDateTimeLocal(new Date().toISOString()),
          type: "medio",
          is_pinned: false,
          is_published: true,
        },
  });

  const type = watch("type");
  const isPinned = watch("is_pinned");
  const isPublished = watch("is_published");

  const onSubmit = (values: NewsItemInput) => {
    startTransition(async () => {
      const result = await upsertNewsAction(values);
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
        {initial ? "Editar nota" : "Nueva nota"}
      </h3>
      <div>
        <Label>Título</Label>
        <Input {...register("title")} />
        {errors.title?.message ? (
          <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
        ) : null}
      </div>
      <div>
        <Label>Resumen</Label>
        <Textarea rows={4} {...register("summary")} />
        {errors.summary?.message ? (
          <p className="mt-1 text-xs text-destructive">{errors.summary.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <Label>Fuente (nombre)</Label>
          <Input {...register("source_name")} placeholder="Ej. Proceso" />
        </div>
        <div>
          <Label>URL de la fuente</Label>
          <Input type="url" {...register("source_url")} />
          {errors.source_url?.message ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.source_url.message}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <Label>URL de imagen (opcional)</Label>
          <Input type="url" {...register("image_url")} />
        </div>
        <div>
          <Label>Fecha de publicación</Label>
          <Input type="datetime-local" {...register("published_at")} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <Label>Tipo</Label>
          <Select
            value={type}
            onValueChange={(v) =>
              setValue("type", v as NewsItemInput["type"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medio">Medio</SelectItem>
              <SelectItem value="social">Redes sociales</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 lg:mt-6">
          <Switch
            id="news-pin"
            checked={!!isPinned}
            onCheckedChange={(v) => setValue("is_pinned", v)}
          />
          <Label htmlFor="news-pin" className="m-0 cursor-pointer">
            Destacar
          </Label>
        </div>
        <div className="flex items-center gap-3 lg:mt-6">
          <Switch
            id="news-published"
            checked={!!isPublished}
            onCheckedChange={(v) => setValue("is_published", v)}
          />
          <Label htmlFor="news-published" className="m-0 cursor-pointer">
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
