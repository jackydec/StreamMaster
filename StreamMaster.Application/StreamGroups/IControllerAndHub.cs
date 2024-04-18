using Microsoft.AspNetCore.Mvc;
using StreamMaster.Application.StreamGroups.Commands;
using StreamMaster.Application.StreamGroups.Queries;

namespace StreamMaster.Application.StreamGroups
{
    public interface IStreamGroupsController
    {        
        Task<ActionResult<PagedResponse<StreamGroupDto>>> GetPagedStreamGroups(QueryStringParameters Parameters);
        Task<ActionResult<APIResponse>> CreateStreamGroup(CreateStreamGroupRequest request);
        Task<ActionResult<APIResponse>> DeleteStreamGroup(DeleteStreamGroupRequest request);
    }
}

namespace StreamMaster.Application.Hubs
{
    public interface IStreamGroupsHub
    {
        Task<PagedResponse<StreamGroupDto>> GetPagedStreamGroups(QueryStringParameters Parameters);
        Task<APIResponse> CreateStreamGroup(CreateStreamGroupRequest request);
        Task<APIResponse> DeleteStreamGroup(DeleteStreamGroupRequest request);
    }
}
