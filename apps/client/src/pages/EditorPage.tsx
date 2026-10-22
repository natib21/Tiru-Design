import { useParams } from 'react-router';

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="flex h-svh flex-col">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-sm">Editor: Project {projectId}</h1>
      </header>
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground text-sm">Design canvas placeholder</p>
      </div>
    </div>
  );
}
