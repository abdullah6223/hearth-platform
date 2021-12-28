
import BaseChart from '@hearth/domains/common/components/BaseChart'

import type { ResidentGroupedCounter } from '@app/hearth/schema'
import type { CustomChartViewType, CustomChartMapType } from '@hearth/domains/analytics/components/CustomChart'
import type { ChartConfigResult } from '@hearth/domains/analytics/components/TicketChart'
import type { TableColumnsType, TableProps } from 'antd'

type ResidentDataType = Array<ResidentGroupedCounter>

type TableConfigResult = {
    dataSource: TableProps<ResidentDataType>['dataSource']
    tableColumns: TableColumnsType
}

class ResidentChart extends BaseChart<
CustomChartMapType<ResidentDataType>, ChartConfigResult, TableConfigResult, CustomChartViewType, ResidentDataType, Record<string, string>
> {
    getChartConfig (viewMode: CustomChartViewType, data: ResidentDataType): ChartConfigResult {
        return this.chartConfigMap[viewMode]['chart'](viewMode, data)
    }

    getTableConfig (viewMode, data, restTableOptions): TableConfigResult {
        return this.chartConfigMap[viewMode]['table'](viewMode, data, restTableOptions)
    }
}

export default ResidentChart
export type { ResidentDataType }
