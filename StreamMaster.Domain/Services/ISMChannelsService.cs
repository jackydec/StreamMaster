﻿using StreamMaster.Domain.API;
using StreamMaster.Domain.Pagination;

namespace StreamMaster.Domain.Services
{
    public interface ISMChannelsService
    {
        Task<DefaultAPIResponse> DeleteSMChannels(List<int> smchannelIds);
        Task<DefaultAPIResponse> DeleteAllSMChannelsFromParameters(SMChannelParameters Parameters);
        Task<APIResponse<SMChannelDto>> GetPagedSMChannels(SMChannelParameters Parameters);
        Task<DefaultAPIResponse> CreateSMChannelFromStream(string streamId);
        Task<DefaultAPIResponse> DeleteSMChannel(int smchannelId);
    }
}