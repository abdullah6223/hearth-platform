import { Col, Row } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import get from 'lodash/get'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageHeader, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { Loader } from '@hearth/domains/common/components/Loader'
import { PageComponentType } from '@hearth/domains/common/types'
import { SettingsReadPermissionRequired } from '@hearth/domains/settings/components/PageAccess'
import {
    OnlyProgressionMeterReadingsForm,
} from '@hearth/domains/settings/components/ticketSubmitting/OnlyProgressionMeterReadingsForm'
import { MobileFeatureConfig } from '@hearth/domains/settings/utils/clientSchema'


const ROW_GUTTER: [Gutter, Gutter] = [0, 60]

const OnlyProgressionMeterReadingsContent: React.FC = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.settings.barItem.MobileFeatureConfig.OnlyProgressionMeterReadings.title' })
    
    const userOrganization = useOrganization()
    const userOrganizationId = get(userOrganization, ['organization', 'id'], null)

    const { obj: mobileConfig, loading } = MobileFeatureConfig.useObject({
        where: {
            organization: { id: userOrganizationId },
        },
    })
    return loading ? <Loader fill size='small'/> : (
        <>
            <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} />
            <Row gutter={ROW_GUTTER}>
                <Col span={24}>
                    <OnlyProgressionMeterReadingsForm mobileConfig={mobileConfig} userOrganizationId={userOrganizationId}/>
                </Col>
            </Row>
        </>
    )
}

const TicketSubmittingPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.settings.ticketDeadlines.pageTitle' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <OnlyProgressionMeterReadingsContent />
                </PageContent>
            </PageWrapper>
        </>
    )
}

TicketSubmittingPage.requiredAccess = SettingsReadPermissionRequired

export default TicketSubmittingPage
