import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useWorkspaces,
  useActiveWorkspace,
  useSwitchWorkspace,
  useCreateTeamWorkspace,
} from '../hooks/use-workspaces';
import { Badge, Button, Input, Dialog } from '@/shared/ui';

export function WorkspaceSwitcher() {
  const { t } = useTranslation(['workspace', 'common']);
  const { data: workspaces = [] } = useWorkspaces();
  const { activeWorkspace, role } = useActiveWorkspace();
  const switchWorkspace = useSwitchWorkspace();
  const createTeamWorkspace = useCreateTeamWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [nameError, setNameError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setNameError('Workspace name is required');
      return;
    }
    setNameError('');
    try {
      await createTeamWorkspace.mutateAsync(teamName.trim());
      setTeamName('');
      setIsModalOpen(false);
      setIsOpen(false);
    } catch {
      setNameError('Failed to create workspace. Try again.');
    }
  };

  const getRoleBadgeVariant = (itemRole?: string) => {
    switch (itemRole) {
      case 'OWNER':
        return 'success';
      case 'ADMIN':
        return 'info';
      case 'VIEWER':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-h-[40px] items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs transition-colors"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={t('switchWorkspace', 'Switch workspace')}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary shrink-0 font-bold text-[10px]">
            {activeWorkspace?.type === 'PERSONAL' ? 'P' : 'T'}
          </div>
          <span className="max-w-[120px] sm:max-w-[160px] truncate">
            {activeWorkspace?.name || 'Workspace'}
          </span>
          <Badge variant={getRoleBadgeVariant(role)} className="text-[10px] py-0 px-1.5">
            {role}
          </Badge>
          <svg
            className={`h-4 w-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute left-0 mt-1.5 z-50 w-72 rounded-xl border border-border bg-surface p-1.5 shadow-lg focus:outline-none"
          >
            <div className="px-3 py-2 border-b border-border-subtle">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                {t('switchWorkspace', 'Switch workspace')}
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto py-1">
              {workspaces.map((workspace) => {
                const isSelected = workspace.id === activeWorkspace?.id;
                return (
                  <button
                    key={workspace.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      switchWorkspace(workspace);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-foreground hover:bg-surface-subtle font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                          workspace.type === 'PERSONAL'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {workspace.type === 'PERSONAL' ? 'P' : 'T'}
                      </div>
                      <span className="truncate">{workspace.name}</span>
                    </div>
                    <Badge variant={getRoleBadgeVariant(workspace.role)} className="text-[10px] py-0 px-1.5 shrink-0">
                      {workspace.role}
                    </Badge>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border-subtle pt-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>{t('createTeamWorkspace', 'Create team workspace')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Team Workspace Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('createTeamWorkspace', 'Create team workspace')}
        description="Team workspaces allow you to collaborate on designs and share brand kits."
      >
        <form onSubmit={handleCreateTeam} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              {t('teamWorkspaceName', 'Team workspace name')}
            </label>
            <Input
              type="text"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                setNameError('');
              }}
              placeholder="e.g. Addis Studio, Marketing Team"
              hasError={Boolean(nameError)}
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-xs text-danger font-medium">{nameError}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createTeamWorkspace.isPending}
            >
              Create workspace
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default WorkspaceSwitcher;
