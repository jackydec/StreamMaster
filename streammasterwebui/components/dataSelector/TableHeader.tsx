import { ExportComponent, HeaderLeft, MultiSelectCheckbox } from '@lib/common/common';
import { SMTextColor } from '../SMTextColor';
import { type DataSelectorProps as DataSelectorProperties } from './DataSelector';

interface TableHeaderProperties {
  dataSelectorProps: DataSelectorProperties;
  enableExport: boolean;
  exportCSV: () => void;
  headerName?: string;
  onMultiSelectClick?: (value: boolean) => void;
  rowClick: boolean;
  setRowClick: (value: boolean) => void;
}

const TableHeader: React.FC<TableHeaderProperties> = ({
  headerName,
  onMultiSelectClick,
  rowClick,
  setRowClick,
  enableExport,
  exportCSV,
  dataSelectorProps
}) => (
  <div className="flex grid flex-row flex-wrap align-items-center justify-content-between debug">
    <div className="col-2 text-sm debug ">
      <SMTextColor text={headerName} />
      <div hidden={dataSelectorProps.selectionMode !== 'selectable'}>
        <MultiSelectCheckbox onMultiSelectClick={onMultiSelectClick} rowClick={rowClick} setRowClick={setRowClick} />
      </div>
    </div>
    <div className="col-10 debug p-0">
      <div className="flex flex-nowrap flex-row justify-content-between">
        <HeaderLeft props={dataSelectorProps} />
        {dataSelectorProps.headerRightTemplate}
        {enableExport && <ExportComponent exportCSV={exportCSV} />}
      </div>
    </div>
  </div>
);

export default TableHeader;
