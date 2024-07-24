﻿namespace StreamMaster.Streams.Domain.Interfaces;
public interface IChannelService
{
    //Task UnRegisterChannelAsync(int smChannelId, CancellationToken cancellationToken = default);
    Task CheckForEmptyChannelsAsync(CancellationToken cancellationToken = default);
    List<IChannelStatus> GetChannelStatusFromStreamUrl(string videoUrl);
    Task<ClientStreamerConfiguration?> GetClientStreamerConfiguration(string UniqueRequestId, CancellationToken cancellationToken = default);
    Task<bool> SwitchChannelToNextStream(IChannelStatus channelStatus, string? overrideNextVideoStreamId = null);
    void Dispose();
    IChannelStatus? GetChannelStatus(int smChannelId);
    List<IChannelStatus> GetChannelStatuses();
    IChannelStatus? GetChannelStatusFromSMChannelId(int smChannelId);
    List<IChannelStatus> GetChannelStatusesFromSMStreamId(string smStreamId);
    int GetGlobalStreamsCount();
    bool HasChannel(int SMChannelId);
    Task<IChannelStatus?> RegisterChannel(ClientStreamerConfiguration config);
    Task<bool> UnRegisterClient(string UniqueRequestId, CancellationToken cancellationToken = default);

    Task<IChannelStatus?> SetupChannel(SMChannelDto smChannel);
    Task<bool> SetNextChildVideoStream(IChannelStatus channelStatus, string? overrideNextVideoStreamId = null);

}