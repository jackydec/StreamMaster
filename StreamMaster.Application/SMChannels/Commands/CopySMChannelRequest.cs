﻿using Microsoft.AspNetCore.Http;

namespace StreamMaster.Application.SMChannels.Commands;

[SMAPI]
[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public record CopySMChannelRequest(int SMChannelId, string NewName) : IRequest<APIResponse>;

internal class CopySMChannelRequestHandler(IRepositoryWrapper Repository, IMessageService messageService, IHubContext<StreamMasterHub, IStreamMasterHub> hubContext, IOptionsMonitor<Setting> settings, IOptionsMonitor<HLSSettings> hlsSettings, IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<CopySMChannelRequest, APIResponse>
{
    public async Task<APIResponse> Handle(CopySMChannelRequest request, CancellationToken cancellationToken)
    {
        APIResponse ret = await Repository.SMChannel.CopySMChannel(request.SMChannelId, request.NewName);
        if (ret.IsError)
        {
            await messageService.SendError($"Could not delete channel", ret.ErrorMessage);
            await messageService.SendSuccess($"Error copying channel {ret.ErrorMessage}");
        }
        else
        {
            await hubContext.Clients.All.DataRefresh(SMChannel.MainGet).ConfigureAwait(false);
            await messageService.SendSuccess($"Copied channel");
        }
        return ret;
    }
}
