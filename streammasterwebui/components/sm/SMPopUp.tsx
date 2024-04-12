import { OverlayPanel } from 'primereact/overlaypanel';
import { SMCard } from './SMCard';
import { useEffect, useRef } from 'react';
import OKButton from '@components/buttons/OKButton';
import XButton from '@components/buttons/XButton';
import BaseButton, { SeverityType } from '@components/buttons/BaseButton';

interface SMPopUpProperties {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly message?: string;
  readonly hidden?: boolean;
  readonly tooltip?: string;
  readonly icon?: string;
  readonly severity?: SeverityType;
  onHide?(): void;
  onShow?(): void;
  OK(): void;
  Cancel?(): void;
}

export const SMPopUp = ({ children, hidden, icon, severity, tooltip, onHide: clientHide, OK, Cancel, onShow, title }: SMPopUpProperties) => {
  const op = useRef<OverlayPanel>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hidden !== undefined) {
      if (hidden) {
        op.current?.hide();
      } else {
        op.current?.show(null, anchorRef.current);
      }
    }
  }, [hidden]);

  console.log('hidden', hidden);

  return (
    <div ref={anchorRef}>
      <OverlayPanel className="flex " ref={op} onHide={clientHide} onShow={onShow}>
        <SMCard title={title}>
          <div className="p-4">{children}</div>
          <div className="flex flex-row justify-content-end align-items-center gap-2 pb-1 pr-1">
            <XButton
              label="Cancel"
              onClick={(event) => {
                op.current?.hide();
                Cancel && Cancel();
              }}
            />
            <OKButton
              onClick={() => {
                op.current?.hide();
                OK();
              }}
            />
          </div>
        </SMCard>
      </OverlayPanel>
      {hidden === undefined && (
        <BaseButton
          onClick={(event) => op.current?.toggle(event)}
          tooltip={tooltip}
          iconFilled={false}
          icon={icon ?? 'pi-plus'}
          severity={severity ?? 'info'}
        />
      )}
    </div>
  );
};
