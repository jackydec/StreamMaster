﻿using StreamMaster.PlayList.Models;

namespace StreamMaster.PlayList
{
    public interface ICustomPlayListBuilder
    {
        CustomStreamNfo? GetIntro();
        (CustomStreamNfo StreamNfo, int SecondsIn) GetCurrentVideoAndElapsedSeconds(string customPlayListName);
        List<CustomPlayList> GetCustomPlayLists();
        CustomPlayList? GetCustomPlayList(string Name);
    }
}