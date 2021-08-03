import { Table, flexRender, RowData } from '@tanstack/react-table'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { createPortal } from 'react-dom'

import { Inbox } from '@open-hearth/icons'
import type { 
    TableLabels, 
} from '@open-hearth/ui/src/components/Table/types'

type TableBodyProps<TData extends RowData = RowData> = Readonly<{
    table: Table<TData>
    onRowClick?: (record: TData) => void
    getRowClassName?: (record: TData) => string | undefined
    dataLoading: boolean
    columnLabels: TableLabels
    tableContainerRef: React.RefObject<HTMLDivElement> | null
}>


export function TableBody <TData extends RowData = RowData> ({ 
    table, 
    onRowClick,
    getRowClassName,
    dataLoading,
    columnLabels,
    tableContainerRef,
}: TableBodyProps<TData>) {
    const createKeyDownHandler = useCallback((row: { original: TData }) => (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onRowClick(row.original)
        }
    }, [onRowClick])

    const rows = table.getRowModel().rows
    const renderLoadingOverlay = useCallback(() => {
        if (!tableContainerRef?.current) return null

        return createPortal(
            <div className='hearth-table-loading-overlay'>
                <div className='hearth-table-loading-spinner' />
            </div>,
            tableContainerRef.current
        )
    }, [tableContainerRef])

    if (rows.length === 0) {

        return (
            dataLoading ? (
                <>
                    <div className='hearth-table-tbody'>
                        <div className='hearth-table-loading-placeholder' />
                    </div>
                    {renderLoadingOverlay()}
                </>
            ) : 
                <div className='hearth-table-tbody'>
                    <div className='hearth-table-empty'>
                        <Inbox className='hearth-table-icon hearth-table-icon-gray hearth-table-empty-icon' />
                        <div className='hearth-table-empty-content'>
                            {columnLabels?.noDataLabel ?? 'No data'}
                        </div>
                    </div>
                </div>
        )
    }
    
    return (
        <>
            <div className='hearth-table-tbody'>
                {rows.map(row => (
                    <div
                        key={row.id}
                        className={classNames('hearth-table-tr', getRowClassName?.(row.original))}
                        role={onRowClick ? 'button' : undefined}
                        tabIndex={onRowClick ? 0 : undefined}
                        onClick={() => onRowClick?.(row.original)}
                        onKeyDown={createKeyDownHandler(row)}
                    >
                        {row.getVisibleCells().map(cell => {

                            return (
                                <div
                                    key={cell.id}
                                    className='hearth-table-td'
                                    style={{ 
                                        width: cell.column.getSize(),
                                    }}
                                >
                                    {dataLoading ? <div className='hearth-table-cell-skeleton' /> : flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </>
    )
}
