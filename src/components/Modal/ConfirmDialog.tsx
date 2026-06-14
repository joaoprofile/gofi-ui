import { type ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/Button';

export type ConfirmTone = 'danger' | 'default';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Specific action verb (e.g. "Delete"), never "OK". */
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  onConfirm: () => void;
  children: ReactNode;
}

/**
 * Small confirmation modal. With `tone="danger"` the confirm button uses
 * `variant="danger"`. Backdrop/Esc only cancel (they don't confirm). It is not
 * dismissable in a destructive flow — the user decides explicitly.
 */
export function ConfirmDialog({
  open,
  onClose,
  title,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      dismissable={tone !== 'danger'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
