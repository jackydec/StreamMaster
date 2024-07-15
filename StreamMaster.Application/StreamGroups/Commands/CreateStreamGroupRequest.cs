﻿using System.Collections.Concurrent;

namespace StreamMaster.Application.StreamGroups.Commands;

[SMAPI]
[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public record CreateStreamGroupRequest(string Name, bool? AutoSetChannelNumbers, bool? IgnoreExistingChannelNumbers, int? StartingChannelNumber) : IRequest<APIResponse>;

[LogExecutionTimeAspect]
public class CreateStreamGroupRequestHandler(IRepositoryWrapper Repository, IMessageService messageService, IDataRefreshService dataRefreshService)
    : IRequestHandler<CreateStreamGroupRequest, APIResponse>
{
    public async Task<APIResponse> Handle(CreateStreamGroupRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Name))
        {
            return APIResponse.NotFound;
        }


        if (request.Name.Equals("all", StringComparison.CurrentCultureIgnoreCase))
        {
            return APIResponse.ErrorWithMessage($"The name '{request.Name}' is reserved");
        }

        ConcurrentDictionary<string, byte> generatedIdsDict = new();
        foreach (StreamGroup channel in Repository.StreamGroup.GetQuery())
        {
            generatedIdsDict.TryAdd(channel.DeviceID, 0);
        }

        StreamGroup streamGroup = new()
        {
            Name = request.Name,
            //IgnoreExistingChannelNumbers = request.IgnoreExistingChannelNumbers ?? true,
            //StartingChannelNumber = request.StartingChannelNumber ?? 1,
            //AutoSetChannelNumbers = request.AutoSetChannelNumbers ?? true,
            DeviceID = UniqueHexGenerator.GenerateUniqueHex(generatedIdsDict)
        };

        streamGroup.StreamGroupProfiles.Add(new StreamGroupProfile
        {
            Name = "Default",
            OutputProfileName = "Default",
            VideoProfileName = "Default"
        });

        Repository.StreamGroup.CreateStreamGroup(streamGroup);
        await Repository.SaveAsync();

        await dataRefreshService.RefreshStreamGroups();

        await messageService.SendSuccess("Stream Group '" + request.Name + "' added successfully");
        return APIResponse.Ok;
    }
}
