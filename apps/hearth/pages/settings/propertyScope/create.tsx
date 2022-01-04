import { Row, Col } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { PropertyScopeForm } from '@hearth/domains/scope/components/PropertyScopeForm'
import { SettingsReadPermissionRequired } from '@hearth/domains/settings/components/PageAccess'


const BIG_VERTICAL_GUTTER: [Gutter, Gutter] = [0, 60]

const CreateTicketPropertyHintPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.hearth.settings.propertyScope.form.newPropertyScope' })

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <Row gutter={BIG_VERTICAL_GUTTER}>
                        <Col span={24}>
                            <Typography.Title level={1}>{PageTitleMsg}</Typography.Title>
                        </Col>
                        <Col span={24}>
                            <PropertyScopeForm/>
                        </Col>
                    </Row>
                </PageContent>
            </PageWrapper>
        </>
    )
}

CreateTicketPropertyHintPage.requiredAccess = SettingsReadPermissionRequired

export default CreateTicketPropertyHintPage
