import { GetSubscribedLineups } from '@lib/smAPI/SchedulesDirect/SchedulesDirectCommands';
import { Logger } from '@lib/common/logger';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchGetSubscribedLineups = createAsyncThunk('cache/getGetSubscribedLineups', async (_: void, thunkAPI) => {
  try {
    Logger.debug('Fetching GetSubscribedLineups');
    const response = await GetSubscribedLineups();
    return {param: _, value: response };
  } catch (error) {
    console.error('Failed to fetch', error);
    return thunkAPI.rejectWithValue({ error: error || 'Unknown error', value: undefined });
  }
});


