import { Row, Col } from 'antd'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { CreateEmployeeForm } from '@hearth/domains/organization/components/EmployeeForm/CreateEmployeeForm'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'
import {
    EmployeesReadAndInvitePermissionRequired,
} from '@hearth/domains/organization/components/PageAccess'


const CreateEmployeePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'employee.AddEmployee' })
        
    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <OrganizationRequired>
                    <PageContent>
                        <Row gutter={[12, 40]}>
                            <Col span={24}>
                                <Typography.Title level={1}>{PageTitleMsg}</Typography.Title>
                            </Col>
                            <Col span={24}>
                                <CreateEmployeeForm />
                            </Col>
                        </Row>
                    </PageContent>
                </OrganizationRequired>
            </PageWrapper>
        </>
    )
}

CreateEmployeePage.requiredAccess = EmployeesReadAndInvitePermissionRequired

export default CreateEmployeePage
