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


const CreateNewsPageContent: React.FC = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'news.create.title' })

    const router = useRouter()

    const { query: { id } } = router as { query: { [key: string]: string } }

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} spaced/>
                <PageContent>
                    <NewsForm
                        id={id}
                        actionName='create'
                    />
                </PageContent>
            </PageWrapper>
        </>
    )
}

const CreateNewsPage: PageComponentType = () => {
    const { canManage, isLoading: isAccessLoading } = useNewsItemsAccess()

    if (isAccessLoading) {
        return <LoadingOrErrorPage error='' loading={true}/>
    }

    if (!canManage) {
        return <AccessDeniedPage/>
    }

    return <CreateNewsPageContent />
}

CreateNewsPage.requiredAccess = NewsReadAndManagePermissionRequired

export default CreateNewsPage
