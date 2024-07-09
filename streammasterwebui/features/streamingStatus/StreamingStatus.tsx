import StandardHeader from '@components/StandardHeader';
import SMTasksDataSelector from '@components/smtasks/SMTasksDataSelector';
import { StreamingStatusIcon } from '@lib/common/icons';
import React from 'react';
import DownloadStatusDataSelector from './DownloadStatusDataSelector';
import SMStreamingStatus from './SMStreamingStatus';

export const StreamingStatus = (): JSX.Element => {
  return (
    <StandardHeader displayName="Streaming Status" icon={<StreamingStatusIcon />}>
      <>
        <div className="layout-padding-bottom" />
        <SMStreamingStatus />
        <div className="layout-padding-bottom-lg" />
        <div className="absolute" style={{ bottom: '0%', width: '97%' }}>
          <DownloadStatusDataSelector />
          <div className="layout-padding-bottom-lg" />
          <SMTasksDataSelector width="100%" height="30vh" />
          <div className="layout-padding-bottom" />
        </div>
      </>
    </StandardHeader>
  );
};

StreamingStatus.displayName = 'Streaming Status';

export default React.memo(StreamingStatus);
