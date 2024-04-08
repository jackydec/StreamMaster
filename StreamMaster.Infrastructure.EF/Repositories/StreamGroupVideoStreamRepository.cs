﻿using AutoMapper;
using AutoMapper.QueryableExtensions;

using MediatR;

using Microsoft.EntityFrameworkCore;

using StreamMaster.Application.StreamGroups.QueriesOld;
using StreamMaster.Domain.API;
using StreamMaster.Domain.Configuration;

using System.Linq.Dynamic.Core;
using System.Text.RegularExpressions;
namespace StreamMaster.Infrastructure.EF.Repositories;

public class StreamGroupVideoStreamRepository(ILogger<StreamGroupVideoStreamRepository> logger, IRepositoryContext repositoryContext, IRepositoryWrapper repository, IMapper mapper, IOptionsMonitor<Setting> intSettings, ISender sender)
    : RepositoryBase<StreamGroupVideoStream>(repositoryContext, logger, intSettings), IStreamGroupVideoStreamRepository
{
    public async Task AddStreamGroupVideoStreams(int StreamGroupId, List<string> toAdd, bool IsReadOnly)
    {
        try
        {
            StreamGroupDto? streamGroup = await repository.StreamGroup.GetStreamGroupById(StreamGroupId).ConfigureAwait(false);

            if (streamGroup == null)
            {
                return;
            }

            List<string> existing = await GetQuery(a => a.StreamGroupId == StreamGroupId).Select(a => a.ChildVideoStreamId).ToListAsync().ConfigureAwait(false);

            List<string> toRun = toAdd.Except(existing).ToList();
            if (!toRun.Any())
            {
                return;
            }

            List<StreamGroupVideoStream> streamGroupVideoStreams = toRun.ConvertAll(videoStreamId => new StreamGroupVideoStream
            {
                StreamGroupId = StreamGroupId,
                ChildVideoStreamId = videoStreamId,
                IsReadOnly = IsReadOnly
            });

            BulkInsert(streamGroupVideoStreams);

            await UpdateRanks(StreamGroupId);

        }
        catch (Exception)
        {
        }
    }

    public async Task<PagedResponse<VideoStreamDto>> GetPagedStreamGroupVideoStreams(StreamGroupVideoStreamParameters Parameters)
    {

        if (Parameters.StreamGroupId == 0 || Parameters == null)
        {
            return repository.VideoStream.CreateEmptyPagedResponse();
        }

        if (!string.IsNullOrEmpty(Parameters.JSONFiltersString) && Regex.IsMatch(Parameters.JSONFiltersString, "streamgroupid", RegexOptions.IgnoreCase))
        {
            Parameters.JSONFiltersString = Regex.Replace(Parameters.JSONFiltersString, "streamgroupid", "user_tvg_name", RegexOptions.IgnoreCase);
        }

        if (Regex.IsMatch(Parameters.OrderBy, "streamgroupid", RegexOptions.IgnoreCase))
        {
            Parameters.OrderBy = Regex.Replace(Parameters.OrderBy, "streamgroupid", "user_tvg_name", RegexOptions.IgnoreCase);
        }

        IQueryable<VideoStream> childQ = RepositoryContext.StreamGroupVideoStreams
        .Include(a => a.ChildVideoStream)
        .Where(a => a.StreamGroupId == Parameters.StreamGroupId)
        .Select(a => a.ChildVideoStream);

        PagedResponse<VideoStreamDto> pagedResponse = await childQ.GetPagedResponseWithFilterAsync<VideoStream, VideoStreamDto>(Parameters.JSONFiltersString, Parameters.OrderBy, Parameters.PageNumber, Parameters.PageSize, mapper).ConfigureAwait(false);

        List<string> streamIds = pagedResponse.Data.ConvertAll(a => a.Id);

        List<StreamGroupVideoStream> existinglinks = RepositoryContext.StreamGroupVideoStreams
            .Where(a => a.StreamGroupId == Parameters.StreamGroupId && streamIds.Contains(a.ChildVideoStreamId) && a.IsReadOnly).ToList();

        foreach (VideoStreamDto item in pagedResponse.Data)
        {
            if (existinglinks.Any(a => a.ChildVideoStreamId == item.Id))
            {
                item.IsReadOnly = true;
            }
        }

        return pagedResponse;
    }
    public async Task<StreamGroupDto?> AddVideoStreamToStreamGroup(int StreamGroupId, string VideoStreamId)
    {
        try
        {
            StreamGroupDto? streamGroup = await repository.StreamGroup.GetStreamGroupById(StreamGroupId).ConfigureAwait(false);

            if (streamGroup == null)
            {
                return null;
            }

            if (GetQuery(a => a.StreamGroupId == StreamGroupId && a.ChildVideoStreamId == VideoStreamId).Any())
            {
                return null;
            }

            Create(new StreamGroupVideoStream { StreamGroupId = StreamGroupId, ChildVideoStreamId = VideoStreamId, Rank = Count() });
            await UpdateRanks(StreamGroupId);
            return (await sender.Send(new GetStreamGroup(StreamGroupId))).Data;
        }
        catch (Exception)
        {
        }
        return null;
    }

    public async Task<List<VideoStreamIsReadOnly>> GetStreamGroupVideoStreamIds(int id)
    {
        if (id == 0)
        {
            return [];
        }

        List<VideoStreamIsReadOnly> ret = await RepositoryContext.StreamGroupVideoStreams.Where(a => a.StreamGroupId == id)
            .AsNoTracking()
            .Select(a => a.ChildVideoStreamId)
            .Select(a => new VideoStreamIsReadOnly { VideoStreamId = a, IsReadOnly = false }).ToListAsync();

        return ret.OrderBy(a => a.Rank).ToList();
    }

    public async Task RemoveStreamGroupVideoStreams(int StreamGroupId, IEnumerable<string> toRemove)
    {
        StreamGroupDto? streamGroup = await repository.StreamGroup.GetStreamGroupById(StreamGroupId).ConfigureAwait(false);

        if (streamGroup == null)
        {
            return;
        }

        IQueryable<StreamGroupVideoStream> toDelete = GetQuery(a => a.StreamGroupId == StreamGroupId && toRemove.Contains(a.ChildVideoStreamId));
        //await PGSQLRepositoryContext.BulkDeleteAsync(toDelete, cancellationToken: cancellationToken).ConfigureAwait(false);

        RepositoryContext.StreamGroupVideoStreams.RemoveRange(toDelete);
        await repository.SaveAsync().ConfigureAwait(false);

        await UpdateRanks(StreamGroupId).ConfigureAwait(false);
    }

    public async Task SetVideoStreamRanks(int StreamGroupId, List<VideoStreamIDRank> videoStreamIDRanks)
    {
        StreamGroupDto? streamGroup = await repository.StreamGroup.GetStreamGroupById(StreamGroupId).ConfigureAwait(false);

        if (streamGroup == null)
        {
            return;
        }

        List<StreamGroupVideoStream> existing = GetQuery(a => a.StreamGroupId == StreamGroupId).ToList();
        foreach (VideoStreamIDRank videoStreamIDRank in videoStreamIDRanks)
        {
            StreamGroupVideoStream? streamGroupVideoStream = existing.FirstOrDefault(a => a.ChildVideoStreamId == videoStreamIDRank.VideoStreamId);
            if (streamGroupVideoStream != null && streamGroupVideoStream.Rank != videoStreamIDRank.Rank)
            {
                streamGroupVideoStream.Rank = videoStreamIDRank.Rank;
                Update(streamGroupVideoStream);
            }
        }
        await repository.SaveAsync().ConfigureAwait(false);
    }

    private async Task UpdateRanks(int StreamGroupId)
    {
        List<StreamGroupVideoStream> sgVs = await GetQuery(a => a.StreamGroupId == StreamGroupId).ToListAsync().ConfigureAwait(false);
        for (int i = 0; i < sgVs.Count; i++)
        {
            sgVs[i].Rank = i;
            Update(sgVs[i]);
        }

        await repository.SaveAsync().ConfigureAwait(false);
    }

    public async Task SetStreamGroupVideoStreamsIsReadOnly(int StreamGroupId, List<string> toUpdate, bool IsReadOnly)
    {
        await GetQuery()
               .Where(a => a.StreamGroupId == StreamGroupId && toUpdate.Contains(a.ChildVideoStreamId))
               .ExecuteUpdateAsync(s => s.SetProperty(b => b.IsReadOnly, IsReadOnly))
               .ConfigureAwait(false);
    }

    public async Task<StreamGroupDto?> SyncVideoStreamToStreamGroup(int StreamGroupId, string VideoStreamId)
    {
        // Fetch the stream group by ID
        StreamGroupDto? targetStreamGroup = await repository.StreamGroup.GetStreamGroupById(StreamGroupId).ConfigureAwait(false);

        if (targetStreamGroup == null)
        {
            return null;
        }

        // Check if the stream is already associated with the group
        StreamGroupVideoStream? isStreamAssociated = await FirstOrDefaultAsync(stream => stream.StreamGroupId == StreamGroupId && stream.ChildVideoStreamId == VideoStreamId);

        if (isStreamAssociated != null)
        {
            if (isStreamAssociated.IsReadOnly)
            {
                return null;
            }
            await RemoveStreamGroupVideoStreams(StreamGroupId, [VideoStreamId]).ConfigureAwait(false);
        }
        else
        {
            await AddVideoStreamToStreamGroup(StreamGroupId, VideoStreamId).ConfigureAwait(false);
        }

        // Fetch and return the updated stream group
        return (await sender.Send(new GetStreamGroup(StreamGroupId))).Data;
    }

    public async Task<List<VideoStreamDto>> GetStreamGroupVideoStreams(int StreamGroupId)
    {
        if (StreamGroupId < 2)
        {
            return await repository.VideoStream.GetVideoStreamsNotHidden().ConfigureAwait(false);
        }

        IQueryable<VideoStream> childQ = GetQuery()
       .Include(a => a.ChildVideoStream)
       .Where(a => a.StreamGroupId == StreamGroupId)
       .Select(a => a.ChildVideoStream)
       .Where(a => !a.IsHidden);

        string test = childQ.ToQueryString();

        return await childQ.ProjectTo<VideoStreamDto>(mapper.ConfigurationProvider).ToListAsync().ConfigureAwait(false);


    }
}