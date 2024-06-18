import store from '@lib/redux/store';
import { setIsForced as GetChannelGroupsSetIsForced } from '@lib/smAPI/ChannelGroups/GetChannelGroupsSlice';
import { setIsForced as GetChannelGroupsFromSMChannelsSetIsForced } from '@lib/smAPI/ChannelGroups/GetChannelGroupsFromSMChannelsSlice';
import { setIsForced as GetEPGColorsSetIsForced } from '@lib/smAPI/EPG/GetEPGColorsSlice';
import { setIsForced as GetEPGFilePreviewByIdSetIsForced } from '@lib/smAPI/EPGFiles/GetEPGFilePreviewByIdSlice';
import { setIsForced as GetEPGFilesSetIsForced } from '@lib/smAPI/EPGFiles/GetEPGFilesSlice';
import { setIsForced as GetEPGNextEPGNumberSetIsForced } from '@lib/smAPI/EPGFiles/GetEPGNextEPGNumberSlice';
import { setIsForced as GetFileProfilesSetIsForced } from '@lib/smAPI/Profiles/GetFileProfilesSlice';
import { setIsForced as GetIconsSetIsForced } from '@lib/smAPI/Icons/GetIconsSlice';
import { setIsForced as GetIsSystemReadySetIsForced } from '@lib/smAPI/General/GetIsSystemReadySlice';
import { setIsForced as GetM3UFileNamesSetIsForced } from '@lib/smAPI/M3UFiles/GetM3UFileNamesSlice';
import { setIsForced as GetM3UFilesSetIsForced } from '@lib/smAPI/M3UFiles/GetM3UFilesSlice';
import { setIsForced as GetPagedChannelGroupsSetIsForced } from '@lib/smAPI/ChannelGroups/GetPagedChannelGroupsSlice';
import { setIsForced as GetPagedEPGFilesSetIsForced } from '@lib/smAPI/EPGFiles/GetPagedEPGFilesSlice';
import { setIsForced as GetPagedM3UFilesSetIsForced } from '@lib/smAPI/M3UFiles/GetPagedM3UFilesSlice';
import { setIsForced as GetPagedSMChannelsSetIsForced } from '@lib/smAPI/SMChannels/GetPagedSMChannelsSlice';
import { setIsForced as GetPagedSMStreamsSetIsForced } from '@lib/smAPI/SMStreams/GetPagedSMStreamsSlice';
import { setIsForced as GetPagedStreamGroupsSetIsForced } from '@lib/smAPI/StreamGroups/GetPagedStreamGroupsSlice';
import { setIsForced as GetSettingsSetIsForced } from '@lib/smAPI/Settings/GetSettingsSlice';
import { setIsForced as GetSMChannelSetIsForced } from '@lib/smAPI/SMChannels/GetSMChannelSlice';
import { setIsForced as GetSMChannelNamesSetIsForced } from '@lib/smAPI/SMChannels/GetSMChannelNamesSlice';
import { setIsForced as GetSMChannelStreamsSetIsForced } from '@lib/smAPI/SMChannelStreamLinks/GetSMChannelStreamsSlice';
import { setIsForced as GetSMTasksSetIsForced } from '@lib/smAPI/SMTasks/GetSMTasksSlice';
import { setIsForced as GetStationChannelNamesSetIsForced } from '@lib/smAPI/SchedulesDirect/GetStationChannelNamesSlice';
import { setIsForced as GetStreamGroupSetIsForced } from '@lib/smAPI/StreamGroups/GetStreamGroupSlice';
import { setIsForced as GetStreamGroupProfilesSetIsForced } from '@lib/smAPI/StreamGroups/GetStreamGroupProfilesSlice';
import { setIsForced as GetStreamGroupsSetIsForced } from '@lib/smAPI/StreamGroups/GetStreamGroupsSlice';
import { setIsForced as GetStreamGroupSMChannelsSetIsForced } from '@lib/smAPI/StreamGroupSMChannelLinks/GetStreamGroupSMChannelsSlice';
import { setIsForced as GetSystemStatusSetIsForced } from '@lib/smAPI/General/GetSystemStatusSlice';
import { setIsForced as GetTaskIsRunningSetIsForced } from '@lib/smAPI/General/GetTaskIsRunningSlice';
import { setIsForced as GetVideoProfilesSetIsForced } from '@lib/smAPI/Profiles/GetVideoProfilesSlice';

export const DataRefreshAll = () => {
  store.dispatch(GetChannelGroupsSetIsForced({ force: true }));
  store.dispatch(GetChannelGroupsFromSMChannelsSetIsForced({ force: true }));
  store.dispatch(GetEPGColorsSetIsForced({ force: true }));
  store.dispatch(GetEPGFilePreviewByIdSetIsForced({ force: true }));
  store.dispatch(GetEPGFilesSetIsForced({ force: true }));
  store.dispatch(GetEPGNextEPGNumberSetIsForced({ force: true }));
  store.dispatch(GetFileProfilesSetIsForced({ force: true }));
  store.dispatch(GetIconsSetIsForced({ force: true }));
  store.dispatch(GetIsSystemReadySetIsForced({ force: true }));
  store.dispatch(GetM3UFileNamesSetIsForced({ force: true }));
  store.dispatch(GetM3UFilesSetIsForced({ force: true }));
  store.dispatch(GetPagedChannelGroupsSetIsForced({ force: true }));
  store.dispatch(GetPagedEPGFilesSetIsForced({ force: true }));
  store.dispatch(GetPagedM3UFilesSetIsForced({ force: true }));
  store.dispatch(GetPagedSMChannelsSetIsForced({ force: true }));
  store.dispatch(GetPagedSMStreamsSetIsForced({ force: true }));
  store.dispatch(GetPagedStreamGroupsSetIsForced({ force: true }));
  store.dispatch(GetSettingsSetIsForced({ force: true }));
  store.dispatch(GetSMChannelSetIsForced({ force: true }));
  store.dispatch(GetSMChannelNamesSetIsForced({ force: true }));
  store.dispatch(GetSMChannelStreamsSetIsForced({ force: true }));
  store.dispatch(GetSMTasksSetIsForced({ force: true }));
  store.dispatch(GetStationChannelNamesSetIsForced({ force: true }));
  store.dispatch(GetStreamGroupSetIsForced({ force: true }));
  store.dispatch(GetStreamGroupProfilesSetIsForced({ force: true }));
  store.dispatch(GetStreamGroupsSetIsForced({ force: true }));
  store.dispatch(GetStreamGroupSMChannelsSetIsForced({ force: true }));
  store.dispatch(GetSystemStatusSetIsForced({ force: true }));
  store.dispatch(GetTaskIsRunningSetIsForced({ force: true }));
  store.dispatch(GetVideoProfilesSetIsForced({ force: true }));
};
