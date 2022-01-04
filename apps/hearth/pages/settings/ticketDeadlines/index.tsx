import { Col, Row } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageHeader, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { SettingsReadPermissionRequired } from '@hearth/domains/settings/components/PageAccess'
import {
    TicketDeadlineSettingsAbout,
} from '@hearth/domains/ticket/components/TicketOrganizationDeadline/TicketDeadlineSettingsAbout'
import { TicketDeadlineSettingsForm } from '@hearth/domains/ticket/components/TicketOrganizationDeadline/TicketDeadlineSettingsForm'


const ROW_GUTTER: [Gutter, Gutter] = [0, 60]

const TicketDeadlinesContent: React.FC = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.settings.ticketDeadlines.pageTitle' })

    return (
        <>
            <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} />
            <Row gutter={ROW_GUTTER}>
                <Col span={24}>
                    <TicketDeadlineSettingsAbout />
                </Col>
                <Col span={24}>
                    <TicketDeadlineSettingsForm />
                </Col>
            </Row>
        </>
    )
}

const TicketDeadlinesPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.hearth.settings.ticketDeadlines.pageTitle' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <TicketDeadlinesContent />
                </PageContent>
            </PageWrapper>
        </>
    )
}

TicketDeadlinesPage.requiredAccess = SettingsReadPermissionRequired

export default TicketDeadlinesPage
