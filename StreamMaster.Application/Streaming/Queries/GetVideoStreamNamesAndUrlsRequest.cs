﻿//using Azure.Core;
//using Microsoft.AspNetCore.Http;
//using StreamMaster.Application.Crypto.Commands;

//using System.Web;
//namespace StreamMaster.Application.Streaming.Queries;

//[SMAPI]
//[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
//public record GetVideoStreamNamesAndUrlsRequest() : IRequest<DataResponse<List<SMStreamInfo>>>;

//internal class GetVideoStreamNamesAndUrlsHandler(IOptionsMonitor<HLSSettings> intHLSettings,ISender sender, IOptionsMonitor<Setting> intSettings, IHttpContextAccessor httpContextAccessor, IRepositoryWrapper Repositorywrapper) : IRequestHandler<GetVideoStreamNamesAndUrlsRequest, DataResponse<List<SMStreamInfo>>>
//{

//    public async Task<DataResponse<List<SMStreamInfo>>> Handle(GetVideoStreamNamesAndUrlsRequest request, CancellationToken cancellationToken)
//    {
//        string url = httpContextAccessor.GetUrl();
//        Setting settings = intSettings.CurrentValue;
//        HLSSettings hlsSettings = intHLSettings.CurrentValue;

//        List<SMStreamInfo> matchedIds = await Repositorywrapper.SMChannel.GetQuery()
//            .Where(vs => !vs.IsHidden)
//            .OrderBy(vs => vs.Name)
//            .Select(vs => new SMStreamInfo(vs.Id, vs.Name, GetVideoStreamUrl(vs, hlsSettings, settings, url)))
//            .ToListAsync(cancellationToken: cancellationToken);


//        return DataResponse<List<SMStreamInfo>>.Success(matchedIds);

//    }
//    private  async Task<string> GetVideoStreamUrl(SMChannel SMChannel, HLSSettings hlsSettings, Setting settings, string url)
//    {
//        //if (hlsSettings.HLSM3U8Enable)
//        //{
//        //    return $"{url}/api/stream/{SMChannel.Id}.m3u8";
//        //}

//        (string EncodedString, string CleanName) = await sender.Send(new EncodeStreamGroupIdProfileIdChannelId(request.StreamGroupId, request.StreamGroupProfileId, smChannel, iv), cancellationToken);
//        if (string.IsNullOrEmpty(EncodedString) || string.IsNullOrEmpty(CleanName))
//        {
//            continue;
//        }
//        string encodedName = HttpUtility.HtmlEncode(SMChannel.Name).Trim()
//        .Replace("/", "")
//        .Replace(" ", "_");

//        string encodedNumbers = 0.EncodeValues128(SMChannel.Id, settings.ServerKey);
//        return $"{url}/api/videostreams/stream/{encodedNumbers}/{encodedName}";
//    }
//}