import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageHeader, PageWrapper, PageContent } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { IncidentForm } from '@hearth/domains/ticket/components/IncidentForm'
import { IncidentReadAndManagePermissionRequired } from '@hearth/domains/ticket/components/PageAccess'


const CreateIncidentPageContent: React.FC = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'incident.create.title' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} />
                <PageContent>
                    <IncidentForm />
                </PageContent>
            </PageWrapper>
        </>
    )
}

const CreateIncidentPage: PageComponentType = () => {
    return <CreateIncidentPageContent />
}

CreateIncidentPage.requiredAccess = IncidentReadAndManagePermissionRequired

export default CreateIncidentPage
