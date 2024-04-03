import AddButton from '@components/buttons/AddButton';

import M3UFilesButton from '@components/m3u/M3UFilesButton';
import StreamCopyLinkDialog from '@components/smstreams/StreamCopyLinkDialog';
import StreamVisibleDialog from '@components/smstreams/StreamVisibleDialog';
import { useSelectSMStreams } from '@lib/redux/slices/selectedSMStreams';
import { useQueryFilter } from '@lib/redux/slices/useQueryFilter';
import { AddSMStreamToSMChannel, CreateSMChannelFromStream } from '@lib/smAPI/SMChannels/SMChannelsCommands';

import useGetPagedSMStreams from '@lib/smAPI/SMStreams/useGetPagedSMStreams';
import { CreateSMChannelFromStreamRequest, SMChannelDto, SMStreamDto } from '@lib/smAPI/smapiTypes';

import SMDataTable from '@components/smDataTable/SMDataTable';
import getRecord from '@components/smDataTable/helpers/getRecord';
import { ColumnMeta } from '@components/smDataTable/types/ColumnMeta';
import { GetMessage } from '@lib/common/common';
import { DataTableRowClickEvent, DataTableRowEvent, DataTableValue } from 'primereact/datatable';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import useSelectedSMItems from './useSelectedSMItems';

interface SMStreamDataSelectorProperties {
  readonly enableEdit?: boolean;
  readonly id: string;
  readonly showSelections?: boolean;
}

const SMStreamDataSelector = ({ enableEdit: propsEnableEdit, id, showSelections }: SMStreamDataSelectorProperties) => {
  const dataKey = `${id}-SMStreamDataSelector`;
  const { selectedSMChannel, setSelectedSMChannel, selectSelectedItems } = useSelectedSMItems();

  const [enableEdit, setEnableEdit] = useState<boolean>(true);
  const { setSelectedSMStreams } = useSelectSMStreams(dataKey);

  const { queryFilter } = useQueryFilter(dataKey);
  const { isLoading } = useGetPagedSMStreams(queryFilter);

  useEffect(() => {
    if (propsEnableEdit !== enableEdit) {
      setEnableEdit(propsEnableEdit ?? true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsEnableEdit]);

  const actionBodyTemplate = useCallback(
    (data: SMStreamDto) => (
      <div className="flex p-0 justify-content-end align-items-center">
        <StreamCopyLinkDialog realUrl={data.realUrl} />
        <StreamVisibleDialog iconFilled={false} id={dataKey} skipOverLayer values={[data]} />

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
      { field: 'logo', fieldType: 'image', width: '4rem', header: '' },
      { field: 'name', filter: true, sortable: true },
      { field: 'group', filter: true, sortable: true, width: '5rem' },
      { field: 'm3UFileName', filter: true, header: 'M3U', sortable: true, width: '5rem' },
      {
        align: 'right',
        bodyTemplate: actionBodyTemplate,
        field: 'isHidden',
        fieldType: 'actions',
        header: 'Actions',
        width: '5rem'
      }
    ],
    [actionBodyTemplate]
  );

  const addOrRemoveTemplate = useCallback(
    (data: any) => {
      const found = selectSelectedItems.some((item) => item.id === data.id);
      const isSelected = found ?? false;
      let toolTip = 'Add Channel';
      if (selectedSMChannel !== undefined) {
        toolTip = 'Add Stream To "' + selectedSMChannel.name + '"';
        return (
          <div className="flex justify-content-between align-items-center p-0 m-0 pl-1">
            <AddButton
              iconFilled={false}
              onClick={() => {
                AddSMStreamToSMChannel({ smStreamId: data.id, smChannelId: selectedSMChannel?.id ?? 0 })
                  .then((response) => {})
                  .catch((error) => {
                    console.error(error.message);
                    throw error;
                  });
              }}
              tooltip={toolTip}
            />

            {/* {showSelection && <Checkbox checked={isSelected} className="pl-1" onChange={() => addSelection(data)} />} */}
          </div>
        );
      }

      return (
        <div className="flex justify-content-between align-items-center p-0 m-0 pl-1">
          <AddButton
            iconFilled={false}
            onClick={() => {
              CreateSMChannelFromStream({ streamId: data.id } as CreateSMChannelFromStreamRequest)
                .then((response) => {})
                .catch((error) => {
                  console.error(error.message);
                  throw error;
                });
            }}
            tooltip={toolTip}
          />
          {/* {showSelection && <Checkbox checked={isSelected} className="pl-1" onChange={() => addSelection(data)} />} */}
        </div>
      );
    },
    [selectSelectedItems, selectedSMChannel]
  );

  function addOrRemoveHeaderTemplate() {
    const isSelected = false;

    if (!isSelected) {
      return (
        <div className="flex justify-content-between align-items-center p-0 m-0 pl-1">
          {/* <AddButton iconFilled={false} onClick={() => console.log('AddButton')} tooltip="Add All Channels" /> */}
          {/* {showSelection && <Checkbox checked={state.selectAll} className="pl-1" onChange={() => toggleAllSelection()} />} */}
        </div>
      );
    }

    return (
      <div className="flex justify-content-between align-items-center p-0 m-0 pl-1">
        <AddButton iconFilled={false} onClick={() => console.log('AddButton')} />
        {/* {showSelection && <Checkbox checked={state.selectAll} className="pl-1" onChange={() => toggleAllSelection()} />} */}
      </div>
    );
  }

  const rightHeaderTemplate = useMemo(
    () => (
      <div className="flex justify-content-end align-items-center w-full gap-1">
        <div className="">
          <M3UFilesButton />
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
      </div>
    ),
    []
  );

  const setSelectedSMEntity = useCallback(
    (data: DataTableValue, toggle?: boolean) => {
      if (toggle === true && selectedSMChannel !== undefined && data !== undefined && data.id === selectedSMChannel.id) {
        setSelectedSMChannel(undefined);
      } else {
        setSelectedSMChannel(data as SMChannelDto);
      }
    },
    [selectedSMChannel, setSelectedSMChannel]
  );

  const rowClass = useCallback(
    (data: unknown): string => {
      const isHidden = getRecord(data, 'isHidden');

      if (isHidden === true) {
        return 'bg-red-900';
      }

      if (selectedSMChannel !== undefined) {
        const id = getRecord(data, 'id') as number;
        if (id === selectedSMChannel.id) {
          return 'bg-orange-900';
        }
      }

      return '';
    },
    [selectedSMChannel]
  );

  // return (
  //   <>
  //     <ConfirmPopup />
  //     <SMDataTable
  //       columns={columns}
  //       enableClick
  //       selectRow
  //       showExpand
  //       defaultSortField="name"
  //       defaultSortOrder={1}
  //       emptyMessage="No Channels"
  //       headerRightTemplate={rightHeaderTemplate}
  //       headerName={GetMessage('channels').toUpperCase()}
  //       id={dataKey}
  //       isLoading={isLoading}
  //       onRowClick={(e: DataTableRowClickEvent) => {
  //         setSelectedSMEntity(e.data as SMChannelDto, true);
  //         console.log(e);
  //       }}
  //       onClick={(e: any) => {
  //         if (e.target.className && e.target.className === 'p-datatable-wrapper') {
  //           setSelectedSMChannel(undefined);
  //         }
  //       }}
  //       onRowExpand={(e: DataTableRowEvent) => {
  //         setSelectedSMEntity(e.data);
  //       }}
  //       onRowCollapse={(e: DataTableRowEvent) => {
  //         setSelectedSMEntity(e.data);
  //       }}
  //       rowClass={rowClass}
  //       // queryFilter={useGetPagedSMChannels}
  //       // rowExpansionTemplate={rowExpansionTemplate}
  //       selectedItemsKey="selectSelectedSMChannelDtoItems"
  //       style={{ height: 'calc(100vh - 10px)' }}
  //     />
  //   </>
  // );

  return (
    <SMDataTable
      columns={columns}
      defaultSortField="name"
      defaultSortOrder={1}
      addOrRemoveTemplate={addOrRemoveTemplate}
      addOrRemoveHeaderTemplate={addOrRemoveHeaderTemplate}
      emptyMessage="No Streams"
      headerName={GetMessage('m3ustreams').toUpperCase()}
      headerRightTemplate={rightHeaderTemplate}
      isLoading={isLoading}
      id={dataKey}
      onSelectionChange={(value, selectAll) => {
        if (selectAll !== true) {
          setSelectedSMStreams(value as SMStreamDto[]);
        }
      }}
      onClick={(e: any) => {
        if (e.target.className && e.target.className === 'p-datatable-wrapper') {
          setSelectedSMChannel(undefined);
        }
      }}
      onRowExpand={(e: DataTableRowEvent) => {
        setSelectedSMEntity(e.data);
      }}
      onRowClick={(e: DataTableRowClickEvent) => {
        setSelectedSMEntity(e.data, true);
        // props.onRowClick?.(e);
      }}
      rowClass={rowClass}
      queryFilter={useGetPagedSMStreams}
      selectedItemsKey="selectSelectedSMStreamDtoItems"
      style={{ height: 'calc(100vh - 10px)' }}
    />
  );
};

export default memo(SMStreamDataSelector);
