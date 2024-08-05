﻿using StreamMaster.Domain.Events;
using StreamMaster.Domain.Models;

namespace StreamMaster.Streams.Domain.Interfaces
{
    /// <summary>
    /// Defines the methods and events for managing channel distributors in StreamMaster.
    /// </summary>
    public interface IChannelBroadcasterService
    {
        /// <summary>
        /// Occurs when a channel director is stopped.
        /// </summary>
        event AsyncEventHandler<ChannelDirectorStopped>? OnChannelDirectorStoppedEvent;

        /// <summary>
        /// Gets a channel distributor by its string key.
        /// </summary>
        /// <param name="key">The string key of the channel distributor.</param>
        /// <returns>The channel distributor if found; otherwise, <c>null</c>.</returns>
        IChannelBroadcaster? GetChannelBroadcaster(string? key);

        /// <summary>
        /// Gets aggregated metrics for all channel distributors.
        /// </summary>
        /// <returns>A dictionary of aggregated metrics for all channel distributors.</returns>
        IDictionary<string, IStreamHandlerMetrics> GetMetrics();

        /// <summary>
        /// Gets or creates a channel distributor asynchronously.
        /// </summary>
        /// <param name="channelName">The name of the channel.</param>
        /// <param name="smStreamInfo">The stream information for the channel.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>The channel distributor if created; otherwise, <c>null</c>.</returns>
        Task<IChannelBroadcaster?> GetOrCreateChannelDistributorAsync(string channelName, SMStreamInfo smStreamInfo, CancellationToken cancellationToken);

        /// <summary>
        /// Stops and unregisters a channel distributor by its string key.
        /// </summary>
        /// <param name="key">The string key of the channel distributor.</param>
        /// <returns><c>true</c> if the channel distributor was stopped and unregistered; otherwise, <c>false</c>.</returns>
        bool StopAndUnRegister(string key);

        /// <summary>
        /// Gets all channel distributors.
        /// </summary>
        /// <returns>A list of all channel distributors.</returns>
        List<IChannelBroadcaster> GetChannelBroadcasters();
    }
}
