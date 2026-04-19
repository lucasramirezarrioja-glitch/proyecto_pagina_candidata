"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/database.types";

type Supporter = Database["public"]["Tables"]["supporters"]["Row"];

function escape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function ExportCsvButton({ supporters }: { supporters: Supporter[] }) {
  const handleClick = () => {
    const headers = [
      "Nombre",
      "Correo",
      "Municipio",
      "Teléfono",
      "Rol",
      "Consentimiento",
      "Versión",
      "Registrado",
    ];
    const rows = supporters.map((s) =>
      [
        s.full_name,
        s.email,
        s.municipality ?? "",
        s.phone ?? "",
        s.role,
        s.consent_accepted ? "sí" : "no",
        s.consent_version ?? "",
        new Date(s.created_at).toISOString(),
      ]
        .map((v) => escape(String(v)))
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([`\ufeff${csv}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simpatizantes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Descargar CSV
    </Button>
  );
}
