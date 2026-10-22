import { Link, NavLink, Outlet } from 'react-router';
import {
  FolderKanban,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
] as const;

export function ClientLayout() {
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="w-56 border-r flex flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/dashboard" className="font-semibold text-primary">
            TiruDesign
          </Link>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-3 py-2 text-sm ${
                  isActive ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted'
                }`
              }
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t">
          <button
            type="button"
            onClick={clearSession}
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
