"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Inicio", Icon: LayoutGrid },
  { href: "/admin/hero", label: "Hero", Icon: FileText },
  { href: "/admin/biografia", label: "Biografía", Icon: BookOpen },
  { href: "/admin/noticias", label: "Noticias", Icon: Newspaper },
  { href: "/admin/simpatizantes", label: "Simpatizantes", Icon: Users },
  { href: "/admin/ajustes", label: "Ajustes", Icon: Settings },
];

export function AdminShell({
  user,
  children,
}: {
  user: { email: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link
            href="/admin"
            className="font-display text-lg font-semibold text-primary"
          >
            Esthela · Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ href, label, Icon }) => (
            <NavLink
              key={href}
              href={href}
              Icon={Icon}
              label={label}
              active={isActive(pathname, href)}
            />
          ))}
        </nav>
        <SidebarFooter user={user} />
      </aside>

      {/* Header mobile */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
          <Link
            href="/admin"
            className="font-display text-base font-semibold text-primary"
          >
            Esthela · Admin
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Drawer mobile */}
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar menú"
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute right-0 top-0 h-full w-72 bg-background shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <span className="font-display text-base font-semibold">
                  Menú
                </span>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 px-3 py-4">
                {NAV.map(({ href, label, Icon }) => (
                  <NavLink
                    key={href}
                    href={href}
                    Icon={Icon}
                    label={label}
                    active={isActive(pathname, href)}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </nav>
              <SidebarFooter user={user} />
            </aside>
          </div>
        ) : null}

        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  Icon: typeof LayoutGrid;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/80 hover:bg-muted",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function SidebarFooter({ user }: { user: { email: string | null } }) {
  return (
    <div className="border-t border-border p-4">
      <p className="truncate text-xs text-muted-foreground">
        {user.email ?? "Sesión activa"}
      </p>
      <form action={signOutAction} className="mt-3">
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
