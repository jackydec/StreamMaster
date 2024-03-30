import { GetApiArgument, QueryHookResult } from '@lib/apiDefs';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import store from '@lib/redux/store';
import { FieldData, PagedResponse, SMChannelDto } from '@lib/smAPI/smapiTypes';
import { useCallback, useEffect } from 'react';
import { clear, setField, setIsForced, setIsLoading } from './GetPagedSMChannelsSlice';
import { fetchGetPagedSMChannels } from './SMChannelsFetch';

interface ExtendedQueryHookResult extends QueryHookResult<PagedResponse<SMChannelDto> | undefined> {}

interface Result extends ExtendedQueryHookResult {
  Clear: () => void;
  SetField: (fieldData: FieldData) => void;
  SetIsForced: (force: boolean) => void;
  SetIsLoading: (isLoading: boolean, query?: string) => void;
}
const useGetPagedSMChannels = (params?: GetApiArgument | undefined): Result => {
  const dispatch = useAppDispatch();
  const query = JSON.stringify(params);

  const data = useAppSelector((state) => state.GetPagedSMChannels.data[query]);
  const isLoading = useAppSelector((state) => state.GetPagedSMChannels.isLoading[query] ?? false);
  const isForced = useAppSelector((state) => state.GetPagedSMChannels.isForced ?? false);
  const isError = useAppSelector((state) => state.GetPagedSMChannels.isError[query] ?? false);
  const error = useAppSelector((state) => state.GetPagedSMChannels.error[query] ?? '');

  const SetIsForced = useCallback(
    (forceRefresh: boolean, query?: string): void => {
      dispatch(setIsForced({ force: forceRefresh }));
    },
    [dispatch]
  );

  const SetIsLoading = useCallback(
    (isLoading: boolean, query?: string): void => {
      dispatch(setIsLoading({ query: query, isLoading: isLoading }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (query === undefined) return;
    const state = store.getState().GetPagedSMChannels;

    if (data === undefined && state.isLoading[query] !== true && state.isForced !== true) {
      SetIsForced(true);
    }
  }, [SetIsForced, data, dispatch, query]);

  useEffect(() => {
    if (isLoading) return;
    if (query === undefined && !isForced) return;
    if (data !== undefined && !isForced) return;

    SetIsLoading(true);
    dispatch(fetchGetPagedSMChannels(query));
  }, [data, dispatch, query, isForced, isLoading, SetIsLoading]);

  const SetField = (fieldData: FieldData): void => {
    dispatch(setField({ fieldData: fieldData }));
  };

  const Clear = (): void => {
    dispatch(clear());
  };

  return {
    data,
    error,
    isError,
    isLoading,
    Clear,
    SetField,
    SetIsForced,
    SetIsLoading
  };
};

export default useGetPagedSMChannels;
