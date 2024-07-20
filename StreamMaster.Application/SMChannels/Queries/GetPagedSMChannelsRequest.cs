﻿using Microsoft.AspNetCore.Http;

using System.Diagnostics;
using System.Text.Json;
using System.Web;

namespace StreamMaster.Application.SMChannels.Queries;

[SMAPI]
[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public record GetPagedSMChannelsRequest(QueryStringParameters Parameters) : IRequest<PagedResponse<SMChannelDto>>;

internal class GetPagedSMChannelsRequestHandler(IRepositoryWrapper Repository, IOptionsMonitor<Setting> intSettings, IOptionsMonitor<HLSSettings> hlsSettings, IHttpContextAccessor httpContextAccessor)
    : IRequestHandler<GetPagedSMChannelsRequest, PagedResponse<SMChannelDto>>
{
    public async Task<PagedResponse<SMChannelDto>> Handle(GetPagedSMChannelsRequest request, CancellationToken cancellationToken)
    {
        Debug.WriteLine("GetPagedSMChannelsRequestHandler");

        if (request.Parameters.PageSize == 0)
        {
            return Repository.SMChannel.CreateEmptyPagedResponse();
        }

        PagedResponse<SMChannelDto> res = await Repository.SMChannel.GetPagedSMChannels(request.Parameters).ConfigureAwait(false);

        string Url = httpContextAccessor.GetUrl();
       

        foreach (SMChannelDto channel in res.Data)
        {
            List<SMChannelStreamLink> links = [.. Repository.SMChannelStreamLink.GetQuery(true).Where(a => a.SMChannelId == channel.Id)];

            string videoUrl;
            foreach (SMStreamDto stream in channel.SMStreams)
            {
                SMChannelStreamLink? link = links.Find(a => a.SMStreamId == stream.Id);

                if (link != null)
                {
                    stream.Rank = link.Rank;
                }
            }

            channel.SMStreams = [.. channel.SMStreams.OrderBy(a => a.Rank)];
            channel.StreamGroupIds = channel.StreamGroups.Select(a => a.StreamGroupId).ToList();

            if (hlsSettings.CurrentValue.HLSM3U8Enable)
            {
                videoUrl = $"{Url}/api/stream/{channel.Id}.m3u8";
            }
            else
            {
                string encodedName = HttpUtility.HtmlEncode(channel.Name).Trim()
                                    .Replace("/", "")
                                    .Replace(" ", "_");

                string encodedNumbers = 1.EncodeValues128(1, channel.Id, intSettings.CurrentValue.ServerKey);

                videoUrl = $"{Url}/api/videostreams/stream/{encodedNumbers}/{encodedName}";
            }

            string jsonString = JsonSerializer.Serialize(videoUrl);
            channel.StreamUrl = jsonString;
        }

        Debug.WriteLine($"GetPagedSMChannelsRequestHandler returning {res.Data.Count} items");
        return res;
    }
}
