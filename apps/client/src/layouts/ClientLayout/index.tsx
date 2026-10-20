import {
  Bell,
  CreditCard,
  FolderKanban,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  Menu,
  PanelLeft,
  Settings,
  Store,
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router';

import { Button } from '@tirudesign/ui';
import { APP_NAME } from '@/constants/app';
import { useLogout, useSession } from '@/features/auth';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/assets', label: 'Assets', icon: Images },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function ClientLayout() {
  const { data: session } = useSession();
  const logout = useLogout();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <div className="flex min-h-svh bg-background">
      <aside
        className={cn(
          'hidden border-r md:flex md:flex-col',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-3">
          <Link to="/dashboard" className="min-w-0 truncate font-semibold">
            {collapsed ? 'TD' : APP_NAME}
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                  isActive && 'bg-muted font-medium text-foreground',
                  collapsed && 'justify-center',
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {collapsed ? null : <span className="min-w-0 wrap-break-word">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={toggleSidebar}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <PanelLeft className="size-4" />
            </Button>
            <button
              type="button"
              disabled
              className="min-w-0 truncate rounded-md border px-3 py-1.5 text-sm text-muted-foreground"
            >
              Workspace — coming in identity context
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-40 truncate text-sm sm:inline">
              {session?.user.displayName}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Log out
            </Button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
