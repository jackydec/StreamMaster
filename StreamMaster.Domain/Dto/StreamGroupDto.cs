﻿namespace StreamMaster.Domain.Dto;

[TsInterface(AutoI = false, IncludeNamespace = false, FlattenHierarchy = true, AutoExportMethods = false)]
public class StreamGroupDto : IMapFrom<StreamGroup>
{
    public List<StreamGroupProfileDto> StreamGroupProfiles { get; set; } = [];
    public bool IsLoading { get; set; } = false;
    public bool IsReadOnly { get; set; } = false;
    public bool AutoSetChannelNumbers { get; set; } = false;
    //public int StreamCount { get; set; } = 0;
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

}