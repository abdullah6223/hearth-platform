import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { AccessDeniedPage } from '@hearth/domains/common/components/containers/AccessDeniedPage'
import { PageHeader, PageWrapper, PageContent } from '@hearth/domains/common/components/containers/BaseLayout'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { PageComponentType } from '@hearth/domains/common/types'
import { NewsForm } from '@hearth/domains/news/components/NewsForm'
import { NewsReadAndManagePermissionRequired } from '@hearth/domains/news/components/PageAccess'
import { useNewsItemsAccess } from '@hearth/domains/news/hooks/useNewsItemsAccess'


const UpdateNewsPageContent: React.FC = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'news.update.title' })

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
                    <NewsForm
                        id={id}
                        actionName='update'
                    />
                </PageContent>
            </PageWrapper>
        </>
    )
}

const UpdateNewsPage: PageComponentType = () => {
    const { canManage, isLoading: isAccessLoading } = useNewsItemsAccess()

    if (isAccessLoading) {
        return <LoadingOrErrorPage error='' loading={true}/>
    }

    if (!canManage) {
        return <AccessDeniedPage/>
    }

    return <UpdateNewsPageContent />
}

UpdateNewsPage.requiredAccess = NewsReadAndManagePermissionRequired

export default UpdateNewsPage
