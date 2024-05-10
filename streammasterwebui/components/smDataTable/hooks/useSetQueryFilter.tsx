import { SMDataTableFilterMetaData, addOrUpdateValueForField, hasValidAdditionalProps, isEmptyObject } from '@lib/common/common';

import { QueryStringParameters, areGetApiArgsEqual } from '@lib/apiDefs';
import { useQueryFilter } from '@lib/redux/hooks/queryFilter';
import { useShowHidden } from '@lib/redux/hooks/showHidden';

import { useSortInfo } from '@lib/redux/hooks/sortInfo';

import { useQueryAdditionalFilters } from '@lib/redux/hooks/queryAdditionalFilters';
import { ChannelGroupDto, EPGFileDto } from '@lib/smAPI/smapiTypes';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { useEffect, useMemo } from 'react';
import { ColumnMeta } from '../types/ColumnMeta';

function getSortString(sortInfo: any): string {
  return sortInfo && sortInfo.sortField ? `${sortInfo.sortField} ${sortInfo.sortOrder === -1 ? 'desc' : 'asc'}` : '';
}

function transformAndEnhanceFilters(
  filters: DataTableFilterMeta,
  columns: ColumnMeta[],
  showHidden: boolean | null | undefined,
  additionalFilter: any
): SMDataTableFilterMetaData[] {
  let transformedFilters: SMDataTableFilterMetaData[] = [];

  columns.forEach((column) => {
    const filter = filters[column.field] as SMDataTableFilterMetaData;

    if (filter?.value && filter.value !== '[]') {
      if (column.field === 'EPGId') {
        const epgIds = (filter.value as EPGFileDto[]).filter((x) => x.EPGNumber !== -99).map((x) => x.EPGNumber.toString() + '-');

        if (epgIds.length > 0) {
          transformedFilters.push({
            fieldName: column.field,
            matchMode: FilterMatchMode.STARTS_WITH,
            value: epgIds
          });
        }

        const found = (filter.value as EPGFileDto[]).some((x) => x.EPGNumber === -99);
        if (found) {
          transformedFilters.push({
            fieldName: column.field,
            matchMode: FilterMatchMode.NOT_CONTAINS,
            value: '-'
          });
        }
      } else if (column.field === 'Group') {
        const ids = (filter.value as ChannelGroupDto[]).map((x) => x.Name);

        if (ids.length > 0) {
          transformedFilters.push({
            fieldName: column.field,
            matchMode: FilterMatchMode.CONTAINS,
            value: ids
          });
        }
      } else {
        transformedFilters.push({
          fieldName: column.field,
          matchMode: filter.matchMode,
          value: filter.value
        });
      }
    }
  });

  // Show/Hide logic
  if (showHidden !== null && showHidden !== undefined) {
    addOrUpdateValueForField(transformedFilters, 'IsHidden', FilterMatchMode.EQUALS, String(!showHidden));
  }

  // Additional Filters
  if (hasValidAdditionalProps(additionalFilter)) {
    const { field, values, matchMode } = additionalFilter;
    if (!isEmptyObject(values)) {
      addOrUpdateValueForField(transformedFilters, field, matchMode, JSON.stringify(values));
    }
  }

  return transformedFilters;
}

export const useSetQueryFilter = (
  id: string,
  columns: ColumnMeta[],
  first: number,
  filters: DataTableFilterMeta,
  page: number,
  rows: number,
  StreamGroupId?: number
) => {
  const { sortInfo } = useSortInfo(id);
  const { queryAdditionalFilters } = useQueryAdditionalFilters(id);
  const { showHidden } = useShowHidden(id);
  const { queryFilter, setQueryFilter } = useQueryFilter(id);

  const { generateGetApi } = useMemo(() => {
    const sortString = getSortString(sortInfo);

    // console.group('useSetQueryFilter');
    // console.log('id:', id);
    // console.log('queryFilter:', queryFilter);
    // console.log('queryAdditionalFilters:', queryAdditionalFilters);
    // console.groupEnd();

    const transformedFilters = transformAndEnhanceFilters(filters, columns, showHidden, queryAdditionalFilters);

    const JSONFiltersString = JSON.stringify(transformedFilters);

    const apiState: QueryStringParameters = {
      JSONFiltersString,
      OrderBy: sortString,
      PageNumber: page,
      PageSize: rows,
      StreamGroupId
    };

    return {
      generateGetApi: apiState
    };
  }, [sortInfo, filters, columns, showHidden, queryAdditionalFilters, page, rows, StreamGroupId]);

  useEffect(() => {
    if (!areGetApiArgsEqual(generateGetApi, queryFilter)) {
      setQueryFilter(generateGetApi);
    }
  }, [generateGetApi, queryFilter, setQueryFilter]);

  return { queryFilter: generateGetApi };
};
