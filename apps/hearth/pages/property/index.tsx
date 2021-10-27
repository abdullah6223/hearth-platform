import {
    OrganizationEmployeeRole,
    PropertyWhereInput,
} from '@app/hearth/schema'
import { ColumnsType } from 'antd/lib/table'
import get from 'lodash/get'
import Head from 'next/head'
import React, { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { Typography } from '@open-hearth/ui'

import {
    PageHeader,
    PageWrapper,
} from '@hearth/domains/common/components/containers/BaseLayout'
import { TablePageContent } from '@hearth/domains/common/components/containers/BaseLayout/BaseLayout'
import { useGlobalHints } from '@hearth/domains/common/hooks/useGlobalHints'
import { usePreviousSortAndFilters } from '@hearth/domains/common/hooks/usePreviousQueryParams'
import { PageComponentType } from '@hearth/domains/common/types'
import { FiltersMeta } from '@hearth/domains/common/utils/filters.utils'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'
import BuildingsTable from '@hearth/domains/property/components/BuildingsTable'
import { useTableColumns as usePropertiesTableColumns } from '@hearth/domains/property/hooks/useTableColumns'
import { useTableFilters as usePropertyTableFilters } from '@hearth/domains/property/hooks/useTableFilters'


type PropertiesContentProps = {
    role: Pick<OrganizationEmployeeRole, 'canManageProperties' | 'canReadProperties'>
    baseSearchQuery: PropertyWhereInput
    propertiesTableColumns: ColumnsType
    propertyFilterMeta: FiltersMeta<PropertyWhereInput>[]
    loading?: boolean
    canDownloadProperties?: boolean
}

export const PropertiesContent: React.FC<PropertiesContentProps> = (props) => {
    const {
        role,
        propertyFilterMeta,
        baseSearchQuery,
        propertiesTableColumns,
        loading,
        canDownloadProperties,
    } = props

    const intl = useIntl()
    const PageTitleMessage = intl.formatMessage({ id: 'pages.hearth.property.index.PageTitle' })

    const { GlobalHints } = useGlobalHints()

    return (
        <>
            <Head>
                <title>{PageTitleMessage}</title>
            </Head>
            <PageWrapper>
                {GlobalHints}
                <PageHeader title={<Typography.Title>{PageTitleMessage}</Typography.Title>} />
                <TablePageContent>
                    <BuildingsTable
                        role={role}
                        tableColumns={propertiesTableColumns}
                        propertyFilterMeta={propertyFilterMeta}
                        baseSearchQuery={baseSearchQuery}
                        loading={loading}
                        canDownloadProperties={canDownloadProperties}
                    />
                </TablePageContent>
            </PageWrapper>
        </>
    )
}

const PropertiesPage: PageComponentType = () => {
    const { link, organization } = useOrganization()
    const role = get(link, 'role', {})
    const employeeId = get(link, 'id')

    usePreviousSortAndFilters({ employeeSpecificKey: employeeId })

    const propertyFilterMeta = usePropertyTableFilters()
    const propertiesTableColumns = usePropertiesTableColumns(propertyFilterMeta)

    const baseSearchQuery = useMemo(() => ({
        organization: { id: organization.id, deletedAt: null },
        deletedAt: null,
    }), [organization.id])

    return (
        <PropertiesContent
            baseSearchQuery={baseSearchQuery}
            propertiesTableColumns={propertiesTableColumns}
            propertyFilterMeta={propertyFilterMeta}
            role={role}
        />
    )
}

PropertiesPage.requiredAccess = OrganizationRequired

export default PropertiesPage
