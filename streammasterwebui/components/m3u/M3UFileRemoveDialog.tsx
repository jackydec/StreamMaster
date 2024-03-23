import { memo, useState } from 'react';

import { type DeleteM3UFileRequest, type M3UFileDto } from '@lib/iptvApi';
import FileRemoveDialog from '../sharedEPGM3U/FileRemoveDialog';

interface M3UFileRemoveDialogProperties {
  readonly selectedFile?: M3UFileDto;
}

const M3UFileRemoveDialog = (props: M3UFileRemoveDialogProperties) => {
  const [infoMessage, setInfoMessage] = useState('');

  const deleteFile = () => {
    if (!props.selectedFile) {
      return;
    }

    const toSend = {} as DeleteM3UFileRequest;

    toSend.id = props.selectedFile.id;
    toSend.deleteFile = true;

    // DeleteM3UFile(toSend)
    //   .then(() => {
    //     setInfoMessage('M3U Removed Successfully');
    //   })
    //   .catch((error) => {
    //     setInfoMessage(`M3U Removed Error: ${error.message}`);
    //   });
  };

  return <FileRemoveDialog fileType="m3u" infoMessage={infoMessage} onDeleteFile={deleteFile} />;
};

export default memo(M3UFileRemoveDialog);
