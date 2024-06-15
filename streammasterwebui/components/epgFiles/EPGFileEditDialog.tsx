import { memo, useRef, useState } from 'react';

import OKButton from '@components/buttons/OKButton';
import ResetButton from '@components/buttons/ResetButton';
import SMPopUp from '@components/sm/SMPopUp';
import { EPGFileDto } from '@lib/smAPI/smapiTypes';
import EPGFileDialog, { EPGFileDialogRef } from './EPGFileDialog';

interface EPGFileEditDialogProperties {
  readonly selectedFile: EPGFileDto;
}

const EPGFileEditDialog = ({ selectedFile }: EPGFileEditDialogProperties) => {
  const epgDialogRef = useRef<EPGFileDialogRef>(null);

  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);

  return (
    <SMPopUp
      hasCloseButton={false}
      contentWidthSize="4"
      title="EDIT EPG"
      icon="pi-pencil"
      modal
      placement="bottom-end"
      iconFilled={false}
      buttonClassName="icon-yellow"
      tooltip="Add EPG"
      // onCloseClick={() => {set}
      header={
        <div className="flex w-12 gap-1 justify-content-end align-content-center">
          <ResetButton
            buttonDisabled={!saveEnabled}
            onClick={() => {
              epgDialogRef.current?.reset();
            }}
          />
          <OKButton
            buttonDisabled={!saveEnabled}
            onClick={(request) => {
              epgDialogRef.current?.save();
            }}
          />
        </div>
      }
    >
      <EPGFileDialog ref={epgDialogRef} onSaveEnabled={setSaveEnabled} selectedFile={selectedFile} />
    </SMPopUp>
  );
};

EPGFileEditDialog.displayName = 'EPGFileEditDialog';

export default memo(EPGFileEditDialog);
