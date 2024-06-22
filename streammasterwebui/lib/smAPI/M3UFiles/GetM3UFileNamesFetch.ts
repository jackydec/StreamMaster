import { GetM3UFileNames } from '@lib/smAPI/M3UFiles/M3UFilesCommands';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchGetM3UFileNames = createAsyncThunk('cache/getGetM3UFileNames', async (_: void, thunkAPI) => {
  try {
    const response = await GetM3UFileNames();
    return {param: _, value: response };
  } catch (error) {
    console.error('Failed to fetch', error);
    return thunkAPI.rejectWithValue({ error: error || 'Unknown error', value: undefined });
  }
});


