import { upload as uploadService } from '@lib/FileUploadService';
import { EPGFileDto, M3UFileDto } from '@lib/smAPI/smapiTypes';
import * as axios from 'axios';
import { useCallback, useState } from 'react';

export interface BaseUploadParams {
  name: string;
}

export type UploadParamsSettings = {
  // fileType: 'epg' | 'm3u';
  m3uFileDto?: M3UFileDto;
  epgFileDto?: EPGFileDto;
  // maxStreams?: number;
  // epgNumber?: number;
  // timeShift?: number;
  // color?: string;
  // startingChannelNumber?: number;
  // overwriteChannelNumbers?: boolean;
  // vodTags?: string[];
  file?: File;
};

export type UploadParams = UploadParamsSettings & BaseUploadParams & {};

export function useFileUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [uploadedBytes, setUploadedBytes] = useState<number>(0);
  const [infoMessage, setInfoMessage] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const resetUploadState = useCallback(() => {
    setProgress(0);
    setUploadedBytes(0);
    setInfoMessage(undefined);
    setIsUploading(false);
  }, []);

  const doUpload = useCallback(async (params: UploadParams) => {
    if (params.file) {
      setIsUploading(true);
      try {
        await uploadService({
          name: params.name,
          maxStreamCount: params.m3uFileDto?.MaxStreamCount,
          epgNumber: params.epgFileDto?.EPGNumber,
          timeShift: params.epgFileDto?.TimeShift,
          color: params.epgFileDto?.Color,
          startingChannelNumber: params.m3uFileDto?.StartingChannelNumber,
          overWriteChannels: params.m3uFileDto?.OverwriteChannelNumbers,
          vodTags: params.m3uFileDto?.VODTags,
          file: params.file,
          fileType: params.m3uFileDto === undefined ? 'epg' : 'm3u',
          onUploadProgress: (event: axios.AxiosProgressEvent) => {
            setUploadedBytes(event.loaded);
            const total = event.total === undefined ? 1 : event.total;
            const prog = Math.round((100 * event.loaded) / total);
            setProgress(prog);
          }
        });
        setInfoMessage('M3U file uploaded successfully.');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setInfoMessage(`Error uploading file: ${error.message}`);
        } else {
          setInfoMessage('An unexpected error occurred during upload.');
        }
      } finally {
        setIsUploading(false);
      }
    }
  }, []);

  return { doUpload, progress, uploadedBytes, infoMessage, isUploading, resetUploadState };
}
