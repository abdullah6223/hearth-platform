import { SortOrganizationEmployeesBy } from '@app/hearth/schema'
import styled from '@emotion/styled'
import { Col, Row } from 'antd'
import get from 'lodash/get'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'

import { Search } from '@open-hearth/icons'
import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import {
    ActionBar,
    Button,
    Dropdown,
    DropdownProps,
    Typography,
} from '@open-hearth/ui'
import { colors } from '@open-hearth/ui/colors'

import Input from '@hearth/domains/common/components/antd/Input'
import { PageHeader, PageWrapper, useLayoutContext } from '@hearth/domains/common/components/containers/BaseLayout'
import { TablePageContent } from '@hearth/domains/common/components/containers/BaseLayout/BaseLayout'
import { EmptyListContent } from '@hearth/domains/common/components/EmptyListContent'
import { ActiveModalType } from '@hearth/domains/common/components/Import/BaseImportWrapper'
import { ImportWrapper } from '@hearth/domains/common/components/Import/Index'
import { DEFAULT_PAGE_SIZE, Table } from '@hearth/domains/common/components/Table/Index'
import { TableFiltersContainer } from '@hearth/domains/common/components/TableFiltersContainer'
import { useGlobalHints } from '@hearth/domains/common/hooks/useGlobalHints'
import { usePreviousSortAndFilters } from '@hearth/domains/common/hooks/usePreviousQueryParams'
import { useQueryMappers } from '@hearth/domains/common/hooks/useQueryMappers'
import { useSearch } from '@hearth/domains/common/hooks/useSearch'
import { PageComponentType } from '@hearth/domains/common/types'
import { getFiltersFromQuery } from '@hearth/domains/common/utils/helpers'
import { getPageIndexFromOffset, parseQuery } from '@hearth/domains/common/utils/tables.utils'
import { EmployeesReadPermissionRequired } from '@hearth/domains/organization/components/PageAccess'
import { useEmployeeImporterFunctions } from '@hearth/domains/organization/hooks/useEmployeeImporterFunctions'
import { useTableColumns } from '@hearth/domains/organization/hooks/useTableColumns'
import { useTableFilters } from '@hearth/domains/organization/hooks/useTableFilters'
import { OrganizationEmployee } from '@hearth/domains/organization/utils/clientSchema'
import { IFilters } from '@hearth/domains/organization/utils/helpers'


const DROPDOWN_TRIGGER: DropdownProps['trigger'] = ['hover']
const MOBILE_DROPDOWN_TRIGGER: DropdownProps['trigger'] = ['hover', 'click']

const ADD_EMPLOYEE_ROUTE = '/employee/create'
const SORTABLE_PROPERTIES = ['name', 'role', 'position', 'phone', 'email']
const EMPLOYEE_DEFAULT_SORT_BY = ['createdAt_DESC']

export const EmployeesPageContent = ({
    tableColumns,
    canManageEmployee,
    employees,
    employeesLoading,
    total,
    addEmployeeLabel = undefined,
    refetchEmployees,
    isEmployeeImporterEnabled = true,
}) => {
    const intl = useIntl()
    const PageTitleMessage = intl.formatMessage({ id: 'pages.hearth.employee.PageTitle' })
    const SearchPlaceholder = intl.formatMessage({ id: 'filters.FullSearch' })
    const EmptyListLabel = intl.formatMessage({ id: 'employee.EmptyList.header' })
    const EmptyListMessage = intl.formatMessage({ id: 'employee.EmptyList.title' })
    const AddEmployeeLabel = addEmployeeLabel || intl.formatMessage({ id: 'AddEmployee' })
    const AddEmployeeFillWebFormLabel = intl.formatMessage({ id: 'AddDropdown.FillWebForm' })
    const AddEmployeeFillWebFormDescription = intl.formatMessage({ id: 'employee.AddDropdown.FillWebFormDescription' })
    const AddEmployeeUploadExcelLabel = intl.formatMessage({ id: 'AddDropdown.UploadExcel' })
    const AddEmployeeUploadExcelDescription = intl.formatMessage({ id: 'AddDropdown.UploadExcelDescription' })

    const { isMobile } = useLayoutContext()

    const router = useRouter()
    const filtersFromQuery = getFiltersFromQuery<IFilters>(router.query)

    const { GlobalHints } = useGlobalHints()
    const [columns, employeeNormalizer, employeeValidator, employeeCreator] = useEmployeeImporterFunctions()

    const rowClassName = (record) => {
        return record.isBlocked ? 'ant-table-row-inactive' : ''
    }

    const TableWithInactiveEmployee = styled(Table)`
        .ant-table-row-inactive .ant-typography {
            color: ${colors.gray[7]};
        }
    `


    const handleRowAction = useCallback((record) => {
        return {
            onClick: () => {
                router.push(`/employee/${record.id}`)
            },
        }
    }, [])

    const [search, handleSearchChange] = useSearch<IFilters>()

    const handleAddEmployee = () => router.push(ADD_EMPLOYEE_ROUTE)

    const [activeModal, setActiveModal] = useState<ActiveModalType>(null)

    return (
        <>
            <Head>
                <title>{PageTitleMessage}</title>
            </Head>
            <PageWrapper>
                {GlobalHints}
                <PageHeader title={<Typography.Title>{PageTitleMessage}</Typography.Title>} />
                <TablePageContent>
                    {
                        !employees.length && !filtersFromQuery
                            ? <EmptyListContent
                                label={EmptyListLabel}
                                message={EmptyListMessage}
                                createRoute={ADD_EMPLOYEE_ROUTE}
                                createLabel={AddEmployeeLabel}
                                accessCheck={canManageEmployee}
                            />
                            : <Row gutter={[0, 40]} align='middle'>
                                <Col span={24}>
                                    <TableFiltersContainer>
                                        <Input
                                            placeholder={SearchPlaceholder}
                                            onChange={(e) => {
                                                handleSearchChange(e.target.value)
                                            }}
                                            value={search}
                                            allowClear
                                            suffix={<Search size='medium' color={colors.gray[7]} />}
                                        />
                                    </TableFiltersContainer>
                                </Col>
                                <Col span={24}>
                                    <TableWithInactiveEmployee
                                        totalRows={total}
                                        loading={employeesLoading}
                                        dataSource={employees}
                                        columns={tableColumns}
                                        onRow={handleRowAction}
                                        rowClassName={rowClassName}
                                    />
                                </Col>
                                {
                                    canManageEmployee && (
                                        <Col span={24}>
                                            <ActionBar
                                                actions={[
                                                    <>
                                                        {isEmployeeImporterEnabled ?
                                                            <Dropdown.Button
                                                                type='primary'
                                                                dropdownProps={{
                                                                    trigger: isMobile ? MOBILE_DROPDOWN_TRIGGER : DROPDOWN_TRIGGER,
                                                                    placement: 'topLeft',
                                                                }}
                                                                items={[
                                                                    {
                                                                        key: 'create',
                                                                        label: AddEmployeeFillWebFormLabel,
                                                                        description: AddEmployeeFillWebFormDescription,
                                                                        onClick: handleAddEmployee,
                                                                    },
                                                                    {
                                                                        key: 'import',
                                                                        label: AddEmployeeUploadExcelLabel,
                                                                        description: AddEmployeeUploadExcelDescription,
                                                                        onClick: ()=> setActiveModal('example'),
                                                                    },
                                                                ]
                                                                }
                                                            >
                                                                {AddEmployeeLabel}
                                                            </Dropdown.Button> :
                                                            <Button
                                                                key='create'
                                                                type='primary'
                                                                onClick={handleAddEmployee}
                                                            >
                                                                {AddEmployeeLabel}
                                                            </Button>
                                                        }
                                                    </>,
                                                ]}
                                            />
                                        </Col>
                                    )
                                }
                            </Row>
                    }
                </TablePageContent>
                <ImportWrapper
                    setHandleActiveModal={setActiveModal}
                    handleActiveModal={activeModal}
                    key='import'
                    accessCheck={canManageEmployee}
                    headerRowIndex={1}
                    onFinish={refetchEmployees}
                    columns={columns}
                    rowNormalizer={employeeNormalizer}
                    rowValidator={employeeValidator}
                    objectCreator={employeeCreator}
                    domainName='employee'
                />
            </PageWrapper>
        </>
    )
}

const EmployeesPage: PageComponentType = () => {
    const { link, organization } = useOrganization()
    const userOrganizationId = get(organization, 'id', null)
    const canManageEmployee = get(link, 'role.canInviteNewOrganizationEmployees', null)
    const employeeId = get(link, 'id')

    usePreviousSortAndFilters({ employeeSpecificKey: employeeId })

    const router = useRouter()
    const { filters, sorters, offset } = parseQuery(router.query)
    const currentPageIndex = getPageIndexFromOffset(offset, DEFAULT_PAGE_SIZE)
    const filtersMeta = useTableFilters()
    const { filtersToWhere, sortersToSortBy } = useQueryMappers(filtersMeta, SORTABLE_PROPERTIES)
    const sortBy = sortersToSortBy(sorters, EMPLOYEE_DEFAULT_SORT_BY) as SortOrganizationEmployeesBy[]

    const searchEmployeeQuery = {
        ...filtersToWhere(filters),
        organization: { id: userOrganizationId },
    }

    const {
        loading: employeesLoading,
        count: total,
        objs: employees,
        refetch: refetchEmployees,
    } = OrganizationEmployee.useObjects({
        sortBy,
        where: searchEmployeeQuery,
        skip: (currentPageIndex - 1) * DEFAULT_PAGE_SIZE,
        first: DEFAULT_PAGE_SIZE,
    })

    const tableColumns = useTableColumns(filtersMeta, userOrganizationId, employees)

    return (
        <EmployeesPageContent
            tableColumns={tableColumns}
            canManageEmployee={canManageEmployee}
            employees={employees}
            employeesLoading={employeesLoading}
            total={total}
            refetchEmployees={refetchEmployees}
        />
    )
}

EmployeesPage.requiredAccess = EmployeesReadPermissionRequired

export default EmployeesPage
