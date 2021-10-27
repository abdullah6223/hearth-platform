import { Row, Col, RowProps } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'
import { PropertyForm } from '@hearth/domains/property/components/PropertyForm'


const PAGE_ROW_GUTTER: RowProps['gutter'] = [0, 40]

const UpdatePropertyPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id:'pages.hearth.property.index.UpdatePropertyTitle' })
    const { query: { id } } = useRouter()

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <Row gutter={PAGE_ROW_GUTTER}>
                        <Col span={24}>
                            <Typography.Title level={1}>{PageTitleMsg}</Typography.Title>
                        </Col>
                        <PropertyForm id={id as string}/>
                    </Row>
                </PageContent>
            </PageWrapper>
        </>
    )
}

UpdatePropertyPage.requiredAccess = OrganizationRequired

export default UpdatePropertyPage
