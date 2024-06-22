using Microsoft.AspNetCore.SignalR;

using StreamMaster.Application.Common.Interfaces;
using StreamMaster.Application.Hubs;
using StreamMaster.Application.Services;
using StreamMaster.Domain.Configuration;

namespace StreamMaster.Infrastructure.Services;

public partial class DataRefreshService(IHubContext<StreamMasterHub, IStreamMasterHub> hub) : IDataRefreshService, IDataRefreshServicePartial
{

    public async Task RefreshAll()
    {

        await RefreshChannelGroups(true);
        await RefreshEPG(true);
        await RefreshEPGFiles(true);
        await RefreshGeneral(true);
        await RefreshIcons(true);
        await RefreshM3UFiles(true);
        await RefreshProfiles(true);
        await RefreshSchedulesDirect(true);
        await RefreshSettings(true);
        await RefreshSMChannels(true);
        await RefreshSMChannelStreamLinks(true);
        await RefreshSMStreams(true);
        await RefreshSMTasks(true);
        await RefreshStatistics(true);
        await RefreshStreamGroups(true);
        await RefreshStreamGroupSMChannelLinks(true);
    }

    public async Task RefreshChannelGroups(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetChannelGroups");
        await hub.Clients.All.DataRefresh("GetChannelGroupsFromSMChannels");
        await hub.Clients.All.DataRefresh("GetPagedChannelGroups");
    }

    public async Task RefreshEPG(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetEPGColors");
    }

    public async Task RefreshEPGFiles(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetEPGFilePreviewById");
        await hub.Clients.All.DataRefresh("GetEPGFiles");
        await hub.Clients.All.DataRefresh("GetEPGNextEPGNumber");
        await hub.Clients.All.DataRefresh("GetPagedEPGFiles");
    }

    public async Task RefreshGeneral(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetIsSystemReady");
        await hub.Clients.All.DataRefresh("GetSystemStatus");
        await hub.Clients.All.DataRefresh("GetTaskIsRunning");
    }

    public async Task RefreshIcons(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetIcons");
    }

    public async Task RefreshM3UFiles(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetM3UFileNames");
        await hub.Clients.All.DataRefresh("GetM3UFiles");
        await hub.Clients.All.DataRefresh("GetPagedM3UFiles");
    }

    public async Task RefreshProfiles(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetOutputProfile");
        await hub.Clients.All.DataRefresh("GetOutputProfiles");
        await hub.Clients.All.DataRefresh("GetVideoProfiles");
    }

    public async Task RefreshSchedulesDirect(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetAvailableCountries");
        await hub.Clients.All.DataRefresh("GetChannelNames");
        await hub.Clients.All.DataRefresh("GetHeadends");
        await hub.Clients.All.DataRefresh("GetLineupPreviewChannel");
        await hub.Clients.All.DataRefresh("GetLineups");
        await hub.Clients.All.DataRefresh("GetSelectedStationIds");
        await hub.Clients.All.DataRefresh("GetService");
        await hub.Clients.All.DataRefresh("GetStationChannelMaps");
        await hub.Clients.All.DataRefresh("GetStationChannelNames");
        await hub.Clients.All.DataRefresh("GetStationPreviews");
        await hub.Clients.All.DataRefresh("GetUserStatus");
    }

    public async Task RefreshSettings(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetSettings");
    }

    public async Task RefreshSMChannels(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetPagedSMChannels");
        await hub.Clients.All.DataRefresh("GetSMChannel");
        await hub.Clients.All.DataRefresh("GetSMChannelNames");
        await hub.Clients.All.DataRefresh("GetVideoInfoFromId");
    }

    public async Task RefreshSMChannelStreamLinks(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetSMChannelStreams");
    }

    public async Task RefreshSMStreams(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetPagedSMStreams");
    }

    public async Task RefreshSMTasks(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetSMTasks");
    }

    public async Task RefreshStatistics(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetChannelStreamingStatistics");
        await hub.Clients.All.DataRefresh("GetClientStreamingStatistics");
        await hub.Clients.All.DataRefresh("GetStreamingStatisticsForChannel");
        await hub.Clients.All.DataRefresh("GetStreamStreamingStatistics");
    }

    public async Task RefreshStreamGroups(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetPagedStreamGroups");
        await hub.Clients.All.DataRefresh("GetStreamGroup");
        await hub.Clients.All.DataRefresh("GetStreamGroupProfiles");
        await hub.Clients.All.DataRefresh("GetStreamGroups");
    }

    public async Task RefreshStreamGroupSMChannelLinks(bool alwaysRun = false)
    {

        if (!alwaysRun && !BuildInfo.IsSystemReady)
        {
            return;
        }

        await hub.Clients.All.DataRefresh("GetStreamGroupSMChannels");
    }
}
