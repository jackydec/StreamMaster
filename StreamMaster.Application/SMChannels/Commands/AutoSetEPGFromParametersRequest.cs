﻿namespace StreamMaster.Application.SMChannels.Commands;

[SMAPI]
[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public record AutoSetEPGFromParametersRequest(QueryStringParameters Parameters) : IRequest<APIResponse> { }

[LogExecutionTimeAspect]
public class AutoSetEPGFromParametersRequestHandler(IRepositoryWrapper Repository, IMessageService messageService, IDataRefreshService dataRefreshService)
    : IRequestHandler<AutoSetEPGFromParametersRequest, APIResponse>
{
    public async Task<APIResponse> Handle(AutoSetEPGFromParametersRequest request, CancellationToken cancellationToken)
    {
        var results = await Repository.SMChannel.AutoSetEPGFromParameters(request.Parameters, cancellationToken).ConfigureAwait(false);
        if (results.Count != 0)
        {
            await dataRefreshService.SetField(results);
            await messageService.SendSuccess($"Auto Set EPG For Channels");
        }
        return APIResponse.Ok;
    }
}
