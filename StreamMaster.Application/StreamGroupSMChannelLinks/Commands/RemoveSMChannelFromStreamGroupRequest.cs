﻿namespace StreamMaster.Application.StreamGroupSMChannelLinks.Commands;

[SMAPI]
[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public record RemoveSMChannelFromStreamGroupRequest(int StreamGroupId, int SMChannelId) : IRequest<APIResponse>;

internal class RemoveSMChannelFromStreamGroupRequestHandler(IRepositoryWrapper Repository, IDataRefreshService dataRefreshService) : IRequestHandler<RemoveSMChannelFromStreamGroupRequest, APIResponse>
{
    public async Task<APIResponse> Handle(RemoveSMChannelFromStreamGroupRequest request, CancellationToken cancellationToken)
    {
        APIResponse res = await Repository.StreamGroupSMChannelLink.RemoveSMChannelFromStreamGroup(request.StreamGroupId, request.SMChannelId).ConfigureAwait(false);
        if (res.IsError)
        {
            return APIResponse.ErrorWithMessage(res.ErrorMessage);
        }

        var smChannel = Repository.SMChannel.GetSMChannel(request.SMChannelId);
        var streamGroupIds = smChannel.StreamGroups.Select(a => a.StreamGroupId).ToList();

        FieldData fd = new(SMChannel.MainGet, smChannel.Id, "StreamGroupIds", streamGroupIds);
        await dataRefreshService.SetField([fd]).ConfigureAwait(false);

        await dataRefreshService.ClearByTag(SMChannel.MainGet, "notInSG").ConfigureAwait(false);
        await dataRefreshService.ClearByTag(SMChannel.MainGet, "inSG").ConfigureAwait(false);

        return res;
    }
}
