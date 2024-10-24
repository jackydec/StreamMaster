import SMPopUp from '@components/sm/SMPopUp';
import { useQueryFilter } from '@lib/redux/hooks/queryFilter';
import { useSelectAll } from '@lib/redux/hooks/selectAll';
import { useSelectedItems } from '@lib/redux/hooks/selectedItems';
import { DeleteSMChannels, DeleteSMChannelsFromParameters } from '@lib/smAPI/SMChannels/SMChannelsCommands';
import { DeleteSMChannelsFromParametersRequest, DeleteSMChannelsRequest, SMStreamDto } from '@lib/smAPI/smapiTypes';
import React, { useCallback, useMemo } from 'react';

interface DeleteSMChannelsDialogProperties {
  readonly onClose?: () => void;
  readonly id: string;
  readonly selectedItemsKey: string;
}

const DeleteSMChannelsDialog = ({ id, onClose, selectedItemsKey }: DeleteSMChannelsDialogProperties) => {
  const { selectedItems, setSelectedItems } = useSelectedItems<SMStreamDto>(selectedItemsKey);

  const { selectAll, setSelectAll } = useSelectAll(id);
  const { queryFilter } = useQueryFilter(id);

  const getTotalCount = useMemo(() => selectedItems?.length ?? 0, [selectedItems]);
  const ReturnToParent = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onOkClick = useCallback(async () => {
    if (selectedItems === undefined) {
      ReturnToParent();
      return;
    }

    if (selectAll === true) {
      if (!queryFilter) {
        ReturnToParent();
        return;
      }

      const request = {} as DeleteSMChannelsFromParametersRequest;
      request.Parameters = queryFilter;

      await DeleteSMChannelsFromParameters(request)
        .then(() => {
          setSelectedItems([]);
          setSelectAll(false);
        })
        .catch((error) => {
          console.error(error);
          throw error;
        })
        .finally(() => {
          // dialogRef.current?.hide();
        });

      return;
    }

    if (selectedItems.length === 0) {
      ReturnToParent();

      return;
    }

    const request = {} as DeleteSMChannelsRequest;

    const ids: number[] = selectedItems.map((item) => Number(item.Id));
    request.SMChannelIds = ids;

    await DeleteSMChannels(request)
      .then(() => {
        setSelectedItems([]);
      })
      .catch((error) => {
        console.error('Delete channels Error: ', error.message);
        throw error;
      })
      .finally(() => {
        // dialogRef.current?.hide();
      });
  }, [selectedItems, selectAll, ReturnToParent, queryFilter, setSelectedItems, setSelectAll]);

  return (
    <SMPopUp
      onCloseClick={ReturnToParent}
      onOkClick={onOkClick}
      buttonDisabled={getTotalCount === 0}
      contentWidthSize="2"
      iconFilled
      modal
      info=""
      title="DELETE CHANNELS"
      icon="pi-times"
      buttonClassName="icon-red"
    >
      <div className="text-base">Delete ({selectAll ? 'All' : getTotalCount}) channels?</div>
    </SMPopUp>
  );
};

DeleteSMChannelsDialog.displayName = 'DeleteSMChannelsDialog';

export default React.memo(DeleteSMChannelsDialog);
