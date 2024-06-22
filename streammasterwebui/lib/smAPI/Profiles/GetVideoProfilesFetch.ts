import { GetVideoProfiles } from '@lib/smAPI/Profiles/ProfilesCommands';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchGetVideoProfiles = createAsyncThunk('cache/getGetVideoProfiles', async (_: void, thunkAPI) => {
  try {
    const response = await GetVideoProfiles();
    return {param: _, value: response };
  } catch (error) {
    console.error('Failed to fetch', error);
    return thunkAPI.rejectWithValue({ error: error || 'Unknown error', value: undefined });
  }
});


