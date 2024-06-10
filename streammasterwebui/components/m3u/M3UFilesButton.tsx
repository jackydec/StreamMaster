import SMOverlay from '@components/sm/SMOverlay';
import { OverlayPanel } from 'primereact/overlaypanel';
import { memo, useRef } from 'react';
import M3UFileCreateDialog from './M3UFileCreateDialog';
import M3UFilesDataSelector from './M3UFilesDataSelector';

const M3UFilesButton = () => {
  const op = useRef<OverlayPanel>(null);
  const closeOverlay = () => op.current?.hide();

  return (
    <SMOverlay
      buttonClassName="sm-w-4rem icon-green"
      buttonLabel="M3U"
      contentWidthSize="6"
      header={<M3UFileCreateDialog onUploadComplete={closeOverlay} />}
      icon="pi-upload"
      iconFilled
      title="M3U FILES"
    >
      <M3UFilesDataSelector />
    </SMOverlay>
  );
};

M3UFilesButton.displayName = 'M3UFilesButton';

export interface M3UFilesEditorProperties {}

export default memo(M3UFilesButton);
