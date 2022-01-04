import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageHeader, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { EmployeeRoleForm } from '@hearth/domains/organization/components/EmployeeRoleForm'
import { EmployeeRolesReadAndManagePermissionRequired } from '@hearth/domains/settings/components/PageAccess'


const CreateEmployeeRolePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.employeeRole.create.title' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader>
                    <Typography.Title>{PageTitle}</Typography.Title>
                </PageHeader>
                <PageContent>
                    <EmployeeRoleForm />
                </PageContent>
            </PageWrapper>
        </>
    )
}

CreateEmployeeRolePage.requiredAccess = EmployeeRolesReadAndManagePermissionRequired

export default CreateEmployeeRolePage
