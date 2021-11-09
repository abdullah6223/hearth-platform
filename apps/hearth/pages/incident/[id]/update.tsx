import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageHeader, PageWrapper, PageContent } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { IncidentForm } from '@hearth/domains/ticket/components/IncidentForm'
import { IncidentReadAndManagePermissionRequired } from '@hearth/domains/ticket/components/PageAccess'


const UpdateIncidentPageContent: React.FC = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'incident.update.title' })

    const router = useRouter()

    const { query: { id } } = router as { query: { [key: string]: string } }

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} />
                <PageContent>
                    <IncidentForm id={id} />
                </PageContent>
            </PageWrapper>
        </>
    )
}

const UpdateIncidentPage: PageComponentType = () => {
    return <UpdateIncidentPageContent />
}

UpdateIncidentPage.requiredAccess = IncidentReadAndManagePermissionRequired

export default UpdateIncidentPage
