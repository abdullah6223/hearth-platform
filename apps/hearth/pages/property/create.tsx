import { Row, Col, RowProps } from 'antd'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Tour, Typography } from '@open-hearth/ui'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'
import { PropertyForm } from '@hearth/domains/property/components/PropertyForm'


const PROPERTY_CREATE_PAGE_GUTTER: RowProps['gutter'] = [0, 40]

const CreatePropertyPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.hearth.property.index.CreatePropertyTitle' })

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <Row gutter={PROPERTY_CREATE_PAGE_GUTTER}>
                        <Col span={24}>
                            <Typography.Title level={1}>
                                {PageTitleMsg}
                            </Typography.Title>
                        </Col>
                        <Col span={24}>
                            <Tour.Provider>
                                <PropertyForm/>
                            </Tour.Provider>
                        </Col>
                    </Row>
                </PageContent>
            </PageWrapper>
        </>
    )
}

CreatePropertyPage.requiredAccess = OrganizationRequired

export default CreatePropertyPage
