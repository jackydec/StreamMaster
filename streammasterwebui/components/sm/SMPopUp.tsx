import OKButton from '@components/buttons/OKButton';
import BooleanEditor from '@components/inputs/BooleanEditor';
import { Logger } from '@lib/common/logger';
import { useLocalStorage } from 'primereact/hooks';
import React, { useCallback, useRef } from 'react';
import SMButton from './SMButton';
import { SMCard } from './SMCard';
import SMOverlay, { SMOverlayRef } from './SMOverlay';
import { SMPopUpProperties } from './interfaces/SMPopUpProperties';

interface RememberProps {
  value: boolean;
  checked: boolean;
}

export const SMPopUp: React.FC<SMPopUpProperties> = ({
  children,
  closeButtonDisabled = false,
  contentWidthSize = '2',
  disabled = false,
  okButtonDisabled = false,
  onCloseClick,
  onOkClick,
  rememberKey,
  showRemember = true,
  ...props
}) => {
  const overlayRef = useRef<SMOverlayRef>(null);
  const [remember, setRemeber] = useLocalStorage<RememberProps | null>(null, 'remember-' + rememberKey);

  const checked = remember?.checked ? remember.checked : false ?? false;

  const closed = useCallback(() => {
    onCloseClick?.(); // Call the custom onClick handler if provided
    if (rememberKey && rememberKey !== '' && remember?.checked === true) {
      setRemeber({ checked: true, value: false } as RememberProps);
      Logger.debug('Remember', { remember });
    }
    overlayRef.current?.hide();
  }, [onCloseClick, remember, rememberKey, setRemeber]);

  return (
    <SMOverlay
      ref={overlayRef}
      contentWidthSize={contentWidthSize}
      onAnswered={() => {
        if (rememberKey && rememberKey !== '' && remember !== null) {
          if (remember.checked === true && remember.value !== undefined) {
            if (remember.value === true) {
              onOkClick && onOkClick();
            }
            overlayRef.current?.hide();
          }
        }
      }}
      header={
        <div className="flex align-items-center gap-1">
          {onOkClick && (
            <OKButton
              buttonDisabled={disabled || okButtonDisabled} // Combine the disabled states
              onClick={(e) => {
                if (rememberKey && rememberKey !== '' && remember?.checked === true) {
                  setRemeber({ checked: true, value: true } as RememberProps);
                }
                overlayRef.current?.hide();
                onOkClick && onOkClick();
              }}
              tooltip="Ok"
            />
          )}

          <SMButton
            icon="pi-times"
            iconFilled
            buttonClassName="icon-red"
            buttonDisabled={disabled || closeButtonDisabled}
            onClick={() => closed()}
            tooltip="Close"
          />
        </div>
      }
      answer={remember?.checked ? remember?.value : undefined ?? undefined}
      {...props}
    >
      <SMCard darkBackGround>
        <>
          {children}
          {showRemember && !props.modal && (
            <div className="flex w-full align-items-center justify-content-end pt-1">
              <div className="sm-border-divider pt-1">
                <BooleanEditor
                  label="Don't Ask Again?"
                  labelInline
                  labelSmall
                  checked={checked}
                  onChange={(e) => setRemeber({ checked: e, value: remember?.value } as RememberProps)}
                />
              </div>
            </div>
          )}
        </>
      </SMCard>
    </SMOverlay>
  );
};

export default SMPopUp;
