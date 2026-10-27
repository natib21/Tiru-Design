import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Button, Input } from '@/shared/ui';
import { useCreateProject } from '../hooks/use-projects';

export interface NewDesignModalProps {
  open: boolean;
  onClose: () => void;
}

export const CANVAS_PRESETS = [
  { id: 'hd-landscape', name: 'HD Presentation (16:9)', width: 1920, height: 1080, ratio: '16:9' },
  { id: 'square-post', name: 'Square Social Post (1:1)', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'story-portrait', name: 'Story / Reel (9:16)', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'social-banner', name: 'Header / Banner', width: 1200, height: 630, ratio: '1.9:1' },
  { id: 'print-a4', name: 'Flyer / Print (A4)', width: 1240, height: 1754, ratio: 'A4' },
] as const;

export function NewDesignModal({ open, onClose }: NewDesignModalProps) {
  const { t } = useTranslation(['projects', 'common']);
  const createProject = useCreateProject();

  const [name, setName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<(typeof CANVAS_PRESETS)[number]>(
    CANVAS_PRESETS[0]
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setError('');

    try {
      await createProject.mutateAsync({
        name: name.trim(),
        width: selectedPreset.width,
        height: selectedPreset.height,
      });
      onClose();
    } catch {
      setError('Failed to create design. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('newDesignModalTitle', 'Create New Design')}
      description={t('newDesignModalDesc', 'Choose a preset canvas size or enter custom dimensions.')}
    >
      <form onSubmit={handleSubmit} className="space-y-5 mt-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            {t('projectNameLabel', 'Project name')}
          </label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Tibeb Poster, Wedding Invitation"
            hasError={Boolean(error)}
            autoFocus
          />
          {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
            {t('presetLabel', 'Canvas Preset')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CANVAS_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 text-foreground'
                      : 'border-border bg-surface hover:bg-surface-subtle text-foreground'
                  }`}
                >
                  <span className="text-xs font-bold truncate w-full">{preset.name}</span>
                  <span className="text-[11px] text-text-tertiary tabular-nums mt-0.5">
                    {preset.width} × {preset.height} px
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-border-subtle">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={createProject.isPending}
          >
            {createProject.isPending
              ? t('creating', 'Creating...')
              : t('createBtn', 'Create project')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default NewDesignModal;
