import { GetSMChannel } from '@lib/smAPI/SMChannels/SMChannelsCommands';
import { GetSMChannelRequest } from '../smapiTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchGetSMChannel = createAsyncThunk('cache/getGetSMChannel', async (param: GetSMChannelRequest, thunkAPI) => {
  try {
    const response = await GetSMChannel(param);
    return {param: param, value: response };
  } catch (error) {
    console.error('Failed to fetch', error);
    return thunkAPI.rejectWithValue({ error: error || 'Unknown error', value: undefined });
  }
});


