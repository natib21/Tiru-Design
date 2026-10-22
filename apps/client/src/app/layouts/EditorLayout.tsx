import { Outlet } from 'react-router';

export function EditorLayout() {
  return (
    <div className="flex h-svh w-screen flex-col overflow-hidden bg-background">
      <Outlet />
    </div>
  );
}
