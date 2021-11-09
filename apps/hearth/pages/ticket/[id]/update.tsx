import { Row, Col } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { TicketReadAndManagePermissionRequired } from '@hearth/domains/ticket/components/PageAccess'
import { TicketForm } from '@hearth/domains/ticket/components/TicketForm'
import { prefetchTicket } from '@hearth/domains/ticket/utils/next/Ticket'


const TicketUpdatePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id:'pages.hearth.ticket.index.EditTicketModalTitle' })

    const router = useRouter()
    const { query } = router
    const { id } = query as { id: string }

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <Row gutter={[0, 20]} style={{ height: '100%' }}>
                        <Col span={24}>
                            <Typography.Title level={1}>{PageTitleMsg}</Typography.Title>
                        </Col>
                        <TicketForm id={id}/>
                    </Row>
                </PageContent>
            </PageWrapper>
        </>
    )
}

TicketUpdatePage.requiredAccess = TicketReadAndManagePermissionRequired

TicketUpdatePage.getPrefetchedData = async ({ context, apolloClient }) => {
    const { query } = context
    const { id: ticketId } = query as { id: string }

    await prefetchTicket({ client: apolloClient, ticketId })

    return {
        props: {},
    }
}

export default TicketUpdatePage
