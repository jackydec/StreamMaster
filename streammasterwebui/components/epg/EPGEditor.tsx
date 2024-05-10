import { SetSMChannelEPGId } from '@lib/smAPI/SMChannels/SMChannelsCommands';
import { SMChannelDto, SetSMChannelEPGIdRequest } from '@lib/smAPI/smapiTypes';
import { memo } from 'react';
import EPGSelector from './EPGSelector';

interface EPGEditorProperties {
  readonly data: SMChannelDto;
  readonly enableEditMode?: boolean;
}

const EPGEditor = ({ data, enableEditMode }: EPGEditorProperties) => {
  const onUpdateVideoStream = async (epg: string) => {
    if (!data.Id) {
      return;
    }

    const request = {} as SetSMChannelEPGIdRequest;
    request.SMChannelId = data.Id;
    request.EPGId = epg;

    await SetSMChannelEPGId(request)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <EPGSelector
      enableEditMode={enableEditMode}
      onChange={async (e: string) => {
        await onUpdateVideoStream(e);
      }}
      smChannel={data}
    />
  );
};

export default memo(EPGEditor);
