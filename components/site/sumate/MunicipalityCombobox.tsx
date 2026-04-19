"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { GUERRERO_MUNICIPIOS } from "@/lib/data/guerrero-municipios";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type MunicipalityComboboxProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
};

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function MunicipalityCombobox({
  id,
  value,
  onChange,
  ariaInvalid,
  ariaDescribedBy,
}: MunicipalityComboboxProps) {
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value ?? "");
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  const filteredMunicipalities = useMemo(() => {
    const normalizedQuery = normalizeValue(query);
    if (!normalizedQuery) return GUERRERO_MUNICIPIOS;
    return GUERRERO_MUNICIPIOS.filter((municipality) =>
      normalizeValue(municipality).includes(normalizedQuery),
    );
  }, [query]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setHighlightIndex(-1);
  };

  const selectMunicipality = (municipality: string) => {
    onChange(municipality);
    setQuery(municipality);
    handleOpenChange(false);
  };

  const handleInputChange = (nextValue: string) => {
    setQuery(nextValue);
    onChange(nextValue);
    if (!open) setOpen(true);
    setHighlightIndex(0);
  };

  useEffect(() => {
    if (!open) return;
    if (filteredMunicipalities.length === 0) {
      setHighlightIndex(-1);
      return;
    }
    setHighlightIndex((prev) => {
      if (prev < 0) return 0;
      return Math.min(prev, filteredMunicipalities.length - 1);
    });
  }, [filteredMunicipalities, open]);

  useEffect(() => {
    if (!open || highlightIndex < 0) return;
    const el = document.getElementById(`${id}-opt-${highlightIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, open, id, filteredMunicipalities]);

  const moveHighlight = (delta: number) => {
    const len = filteredMunicipalities.length;
    if (len === 0) return;
    setHighlightIndex((prev) => {
      const base = prev < 0 ? (delta > 0 ? -1 : 0) : prev;
      const next = (base + delta + len) % len;
      return next;
    });
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Input
            id={id}
            value={query}
            onChange={(event) => handleInputChange(event.target.value)}
            onFocus={() => setOpen(true)}
            role="combobox"
            aria-controls={listboxId}
            aria-autocomplete="list"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                handleOpenChange(false);
                return;
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!open) setOpen(true);
                moveHighlight(1);
                return;
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!open) setOpen(true);
                moveHighlight(-1);
                return;
              }
              if (event.key === "Enter") {
                if (
                  open &&
                  highlightIndex >= 0 &&
                  filteredMunicipalities[highlightIndex]
                ) {
                  event.preventDefault();
                  selectMunicipality(filteredMunicipalities[highlightIndex]);
                }
              }
            }}
            placeholder="Escribe o selecciona tu municipio"
            autoComplete="off"
            aria-expanded={open}
            aria-activedescendant={
              open && highlightIndex >= 0
                ? `${id}-opt-${highlightIndex}`
                : undefined
            }
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            className="pr-10"
          />
          <ChevronsUpDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div
          id={listboxId}
          role="listbox"
          aria-label="Municipios de Guerrero"
        >
          <ul className="max-h-[280px] overflow-y-auto">
            {filteredMunicipalities.length > 0 ? (
              filteredMunicipalities.map((municipality, index) => {
                const selected = municipality === value;
                const active = index === highlightIndex;
                return (
                  <li key={municipality}>
                    <button
                      type="button"
                      id={`${id}-opt-${index}`}
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors hover:bg-muted",
                        selected && "bg-muted font-medium text-foreground",
                        active && "ring-1 ring-primary/40 ring-inset",
                      )}
                      onMouseEnter={() => setHighlightIndex(index)}
                      onClick={() => selectMunicipality(municipality)}
                    >
                      <span>{municipality}</span>
                      {selected ? (
                        <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-2 py-2 text-sm text-muted-foreground">
                Sin coincidencias para “{query}”.
              </li>
            )}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
