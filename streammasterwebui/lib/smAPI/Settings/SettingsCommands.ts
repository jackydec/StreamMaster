import SignalRService from '@lib/signalr/SignalRService';
import { UpdateSettingResponse,UpdateSettingRequest,SettingDto,SDSystemStatus } from '@lib/smAPI/smapiTypes';

export const GetIsSystemReady = async (): Promise<boolean | undefined> => {
  const signalRService = SignalRService.getInstance();
  return await signalRService.invokeHubCommand<boolean>('GetIsSystemReady');
};

export const GetSettings = async (): Promise<SettingDto | undefined> => {
  const signalRService = SignalRService.getInstance();
  return await signalRService.invokeHubCommand<SettingDto>('GetSettings');
};

export const GetSystemStatus = async (): Promise<SDSystemStatus | undefined> => {
  const signalRService = SignalRService.getInstance();
  return await signalRService.invokeHubCommand<SDSystemStatus>('GetSystemStatus');
};

export const UpdateSetting = async (): Promise<UpdateSettingResponse | undefined> => {
  const signalRService = SignalRService.getInstance();
  return await signalRService.invokeHubCommand<UpdateSettingResponse>('UpdateSetting');
};

