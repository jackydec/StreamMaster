﻿namespace StreamMaster.Application.SMChannels.Commands;

[SMAPI]
[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public record AutoSetSMChannelNumbersRequest(int StreamGroupId, List<int> SMChannelIds, int? StartingNumber, bool? OverwriteExisting
    ) : IRequest<APIResponse>;

internal class AutoSetSMChannelNumbersRequestHandler(IRepositoryWrapper Repository, IHubContext<StreamMasterHub, IStreamMasterHub> hubContext) : IRequestHandler<AutoSetSMChannelNumbersRequest, APIResponse>
{
    public async Task<APIResponse> Handle(AutoSetSMChannelNumbersRequest request, CancellationToken cancellationToken)
    {

        IdIntResultWithResponse res = await Repository.SMChannel.AutoSetSMChannelNumbers(request.StreamGroupId, request.SMChannelIds, request.StartingNumber, request.OverwriteExisting);
        if (res.APIResponse.IsError)
        {
            return APIResponse.ErrorWithMessage(res.APIResponse.ErrorMessage);
        }
        List<FieldData> ret = [];
        foreach (IdIntResult item in res)
        {
            if (item.Result is SMChannel a)
            {
                ret.Add(new FieldData(SMChannel.APIName, a.Id, "ChannelNumber", a.ChannelNumber));
            }
        }

        if (ret.Count > 0)
        {
            await hubContext.Clients.All.SetField(ret).ConfigureAwait(false);
        }

        //await hubContext.Clients.All.DataRefresh("StreamGroups").ConfigureAwait(false);

        // await hubContext.Clients.All.DataRefresh("StreamGroupSMChannelLinks").ConfigureAwait(false);

        return APIResponse.Success;
    }
}
