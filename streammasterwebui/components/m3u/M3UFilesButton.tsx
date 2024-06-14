import SMOverlay, { SMOverlayRef } from '@components/sm/SMOverlay';
import { memo, useRef } from 'react';
import M3UFileCreateDialog from './M3UFileCreateDialog';
import M3UFilesDataSelector from './M3UFilesDataSelector';

const M3UFilesButton = () => {
  const op = useRef<SMOverlayRef>(null);
  const closeOverlay = () => op.current?.hide();

  return (
    <SMOverlay
      buttonClassName="sm-w-4rem icon-green"
      buttonLabel="M3U"
      contentWidthSize="5"
      header={<M3UFileCreateDialog onUploadComplete={closeOverlay} />}
      icon="pi-upload"
      iconFilled
      info=""
      placement="bottom-end"
      ref={op}
      title="M3U FILES"
    >
      <M3UFilesDataSelector />
    </SMOverlay>
  );
};

M3UFilesButton.displayName = 'M3UFilesButton';

export interface M3UFilesEditorProperties {}

export default memo(M3UFilesButton);
