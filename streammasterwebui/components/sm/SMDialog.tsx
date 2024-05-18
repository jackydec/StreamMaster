import XButton from '@components/buttons/XButton';
import SMButton from '@components/sm/SMButton';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { SMCard } from './SMCard';

interface SMDialogProperties {
  readonly children: React.ReactNode;
  readonly buttonDisabled?: boolean;
  readonly buttonClassName?: string;
  readonly darkBackGround?: boolean;
  readonly header?: React.ReactNode;
  readonly info?: string;
  readonly icon?: string;
  readonly iconFilled?: boolean;
  readonly label?: string;
  readonly showButton?: boolean | null;
  readonly title: string;
  readonly tooltip?: string;
  readonly widthSize?: number;
  readonly position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | undefined;
  onHide?(): void;
}
export interface SMDialogRef {
  close: () => void;
}

const SMDialog = forwardRef<SMDialogRef, SMDialogProperties>((props: SMDialogProperties, ref) => {
  const {
    buttonClassName,
    buttonDisabled,
    children,
    darkBackGround = false,
    header,
    info = '',
    icon = 'pi pi-plus',
    iconFilled = true,
    label,
    onHide,
    position,
    showButton,
    tooltip,
    title,
    widthSize = 4
  } = props;

  useImperativeHandle(ref, () => ({
    props,
    close: () => setVisible(false)
  }));

  const [visible, setVisible] = useState<boolean>(false);

  const borderClass = info !== '' ? 'info-header-text-bottom-border' : 'info-header-text';

  useEffect(() => {
    if (showButton === false) {
      setVisible(true);
    }
  }, [showButton]);

  return (
    <>
      <Dialog
        position={position}
        className={`sm-dialog w-${widthSize}`}
        visible={visible}
        style={{ width: '40vw' }}
        onHide={() => {
          setVisible(false);
          onHide && onHide();
        }}
        content={({ hide }) => (
          <SMCard
            darkBackGround={darkBackGround}
            title={title}
            header={
              <div className="justify-content-end align-items-center flex-row flex gap-1">
                {header}
                <XButton iconFilled onClick={(e) => setVisible(false)} tooltip="Close" />
              </div>
            }
          >
            <div className="sm-card-children">
              <div className={`${borderClass} sm-card-children-info`}>{info}</div>
              <div className="sm-card-children-content">{children}</div>
            </div>
          </SMCard>
        )}
      />
      {/* <div hidden={showButton === false}> */}
      <SMButton
        disabled={buttonDisabled}
        className={buttonClassName}
        iconFilled={iconFilled}
        icon={icon ?? ''}
        iconPos="left"
        label={label}
        isLeft
        tooltip={tooltip}
        onClick={(e) => {
          setVisible(true);
        }}
      />
      {/* </div> */}
    </>
  );
});

export default SMDialog;
