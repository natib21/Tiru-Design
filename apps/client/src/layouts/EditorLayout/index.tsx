import { Outlet } from 'react-router';

export function EditorLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b px-6 py-3">Editor</header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
