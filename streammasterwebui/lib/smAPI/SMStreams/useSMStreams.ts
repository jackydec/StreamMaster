import { FieldData, GetApiArgument, PagedResponse, QueryHookResult,SMStreamDto,DefaultAPIResponse } from '@lib/apiDefs';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { ToggleSMStreamVisibleById } from '@lib/smAPI/SMStreams/SMStreamsCommands';
import { fetchGetPagedSMStreams } from '@lib/smAPI/SMStreams/SMStreamsFetch';
import { clearSMStreams, updateSMStreams } from '@lib/smAPI/SMStreams/SMStreamsSlice';

interface ExtendedQueryHookResult extends QueryHookResult<PagedResponse<SMStreamDto> | undefined> {}

interface SMStreamDtoResult extends ExtendedQueryHookResult {
  toggleSMStreamVisibleById: (id: string) => Promise<DefaultAPIResponse | null>;
  setSMStreamsField: (fieldData: FieldData) => void;
  refreshSMStreams: () => void;
}

const useSMStreams = (params?: GetApiArgument | undefined): SMStreamDtoResult => {
  const query = JSON.stringify(params);
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.SMStreams.data[query]);
  const isLoading = useAppSelector((state) => state.SMStreams.isLoading[query] ?? false);
  const isError = useAppSelector((state) => state.SMStreams.isError[query] ?? false);
  const error = useAppSelector((state) => state.SMStreams.error[query] ?? '');

  useEffect(() => {
    if (params === undefined || data !== undefined) return;
    dispatch(fetchGetPagedSMStreams(query));
  }, [data, dispatch, params, query]);

  const setSMStreamsField = (fieldData: FieldData): void => {
    dispatch(updateSMStreams({ fieldData: fieldData }));
  };

  const refreshSMStreams = (): void => {
    dispatch(clearSMStreams());
  };

  const toggleSMStreamVisibleById = (id: string): Promise<DefaultAPIResponse | null> => {
    return ToggleSMStreamVisibleById(id);
  };

  return { data, error, isError, isLoading, toggleSMStreamVisibleById, refreshSMStreams, setSMStreamsField };
};

export default useSMStreams;
