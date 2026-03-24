'use client';

import { Button } from '@/components/Button';

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  isLoading?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

const ConfirmDialog = (props: ConfirmDialogProps) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4">
      <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-[0_2rem_5rem_rgba(15,23,42,0.22)]">
        <h2 className="text-xl font-semibold text-slate-900">{props.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {props.description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={props.onCancel}
            disabled={props.isLoading}
          >
            {props.cancelLabel ?? 'Cancelar'}
          </Button>

          <Button onClick={props.onConfirm} disabled={props.isLoading}>
            {props.isLoading ? 'Salvando...' : props.confirmLabel ?? 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmDialog };
