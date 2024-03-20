import { ColumnMeta } from '@components/dataSelector/DataSelectorTypes';

import { SMStreamDto, SMStreamSMChannelRequest } from '@lib/apiDefs';

import { GetMessage, arraysContainSameStrings } from '@lib/common/common';
import { ChannelGroupDto } from '@lib/iptvApi';
import { useSelectSMStreams } from '@lib/redux/slices/selectedSMStreams';
import { useQueryAdditionalFilters } from '@lib/redux/slices/useQueryAdditionalFilters';
import { useQueryFilter } from '@lib/redux/slices/useQueryFilter';
import { useSelectedItems } from '@lib/redux/slices/useSelectedItemsSlice';
import { AddSMStreamToSMChannel, CreateSMChannelFromStream } from '@lib/smAPI/SMChannels/SMChannelsCommands';
import useSMStreams from '@lib/smAPI/SMStreams/useSMStreams';

import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from 'react';
const DataSelector2 = lazy(() => import('@components/dataSelector/DataSelector2'));
const StreamCopyLinkDialog = lazy(() => import('@components/smstreams/StreamCopyLinkDialog'));
const StreamVisibleDialog = lazy(() => import('@components/smstreams/StreamVisibleDialog'));

interface SMStreamDataSelectorProperties {
  readonly enableEdit?: boolean;
  readonly id: string;
  readonly reorderable?: boolean;
}

const SMStreamDataSelector = ({ enableEdit: propsEnableEdit, id, reorderable }: SMStreamDataSelectorProperties) => {
  const dataKey = `${id}-SMStreamDataSelector`;

  const { selectSelectedItems } = useSelectedItems<ChannelGroupDto>('selectSelectedChannelGroupDtoItems');
  const [enableEdit, setEnableEdit] = useState<boolean>(true);

  const channelGroupNames = useMemo(() => selectSelectedItems.map((channelGroup) => channelGroup.name), [selectSelectedItems]);

  const { queryAdditionalFilter, setQueryAdditionalFilter } = useQueryAdditionalFilters(dataKey);
  const { setSelectedSMStreams } = useSelectSMStreams(dataKey);

  const { queryFilter } = useQueryFilter(dataKey);
  const { isLoading } = useSMStreams(queryFilter);

  useEffect(() => {
    if (!arraysContainSameStrings(queryAdditionalFilter?.values, channelGroupNames)) {
      setQueryAdditionalFilter({
        field: 'Group',
        matchMode: 'equals',
        values: channelGroupNames
      });
    }
  }, [channelGroupNames, dataKey, queryAdditionalFilter, setQueryAdditionalFilter]);

  useEffect(() => {
    if (propsEnableEdit !== enableEdit) {
      setEnableEdit(propsEnableEdit ?? true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsEnableEdit]);

  const targetActionBodyTemplate = useCallback(
    (data: SMStreamDto) => (
      <div className="flex p-0 justify-content-end align-items-center">
        <Suspense>
          <StreamCopyLinkDialog realUrl={data.realUrl} />
          <StreamVisibleDialog iconFilled={false} id={dataKey} skipOverLayer values={[data]} />
        </Suspense>
        {/* <VideoStreamSetAutoSetEPGDialog iconFilled={false} id={dataKey} skipOverLayer values={[data]} /> */}
        {/* <VideoStreamDeleteDialog iconFilled={false} id={dataKey} values={[data]} /> */}
        {/* <VideoStreamEditDialog value={data} /> */}
        {/* <VideoStreamCopyLinkDialog value={data} />
        <VideoStreamSetTimeShiftDialog iconFilled={false} value={data} />
        <VideoStreamResetLogoDialog value={data} />
        <VideoStreamSetLogoFromEPGDialog value={data} />
        <VideoStreamVisibleDialog iconFilled={false} id={dataKey} skipOverLayer values={[data]} />
        <VideoStreamSetAutoSetEPGDialog iconFilled={false} id={dataKey} skipOverLayer values={[data]} />
        <VideoStreamDeleteDialog iconFilled={false} id={dataKey} values={[data]} />
        <VideoStreamEditDialog value={data} /> */}
      </div>
    ),
    [dataKey]
  );

  const columns = useMemo(
    (): ColumnMeta[] => [
      { field: 'logo', fieldType: 'image', width: '4rem' },
      { field: 'name', filter: true, sortable: true },
      { field: 'group', filter: true, sortable: true, width: '5rem' },
      { field: 'm3UFileName', filter: true, header: 'M3U', sortable: true, width: '5rem' },
      {
        align: 'right',
        bodyTemplate: targetActionBodyTemplate,
        field: 'isHidden',
        fieldType: 'actions',
        header: 'Actions',
        width: '5rem'
      }
    ],
    [targetActionBodyTemplate]
  );

  const rightHeaderTemplate = useMemo(
    () => (
      <div className="flex justify-content-end align-items-center w-full gap-1">
        {/* <TriSelectShowHidden dataKey={dataKey} />
        <VideoStreamSetTimeShiftsDialog id={dataKey} />
        <VideoStreamResetLogosDialog id={dataKey} />
        <VideoStreamSetLogosFromEPGDialog id={dataKey} />
        <AutoSetChannelNumbers id={dataKey} />
        <VideoStreamVisibleDialog id={dataKey} />
        <VideoStreamSetAutoSetEPGDialog iconFilled id={dataKey} />
        <VideoStreamDeleteDialog iconFilled id={dataKey} />
        <VideoStreamAddDialog group={channelGroupNames?.[0]} /> */}
      </div>
    ),
    []
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataSelector2
        columns={columns}
        defaultSortField="name"
        defaultSortOrder={1}
        emptyMessage="No Streams"
        headerName={GetMessage('m3ustreams').toUpperCase()}
        headerRightTemplate={rightHeaderTemplate}
        isLoading={isLoading}
        id={dataKey}
        onChannelAdd={(e) => {
          console.log('Add', e);
          CreateSMChannelFromStream(e.id)
            .then((response) => {})
            .catch((error) => {
              console.error(error.message);
            });
        }}
        onStreamAdd={(e: SMStreamSMChannelRequest) => {
          AddSMStreamToSMChannel(e)
            .then((response) => {})
            .catch((error) => {
              console.error(error.message);
            });
        }}
        onDelete={(e) => {
          console.log('Delete', e);
        }}
        onSelectionChange={(value, selectAll) => {
          if (selectAll !== true) {
            setSelectedSMStreams(value as SMStreamDto[]);
          }
        }}
        queryFilter={useSMStreams}
        selectedSMStreamKey="SMChannelDataSelector"
        selectedSMChannelKey="SMChannelDataSelector"
        selectedItemsKey="selectSelectedSMStreamDtoItems"
        // selectionMode="multiple"
        style={{ height: 'calc(100vh - 40px)' }}
      />
    </Suspense>
  );
};

export default memo(SMStreamDataSelector);
