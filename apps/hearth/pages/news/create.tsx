import get from 'lodash/get'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { Typography } from '@open-hearth/ui'

import { AccessDeniedPage } from '@hearth/domains/common/components/containers/AccessDeniedPage'
import { PageHeader, PageWrapper, PageContent } from '@hearth/domains/common/components/containers/BaseLayout'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { EmptyListContent } from '@hearth/domains/common/components/EmptyListContent'
import { PageComponentType } from '@hearth/domains/common/types'
import { NewsForm } from '@hearth/domains/news/components/NewsForm'
import { NewsReadAndManagePermissionRequired } from '@hearth/domains/news/components/PageAccess'
import { useNewsItemsAccess } from '@hearth/domains/news/hooks/useNewsItemsAccess'
import { Property } from '@hearth/domains/property/utils/clientSchema'


interface ICreateNewsPageContentProps {
    propertiesCount?: number
    canManage?: boolean
}

const CreateNewsPageContent: React.FC<ICreateNewsPageContentProps> = ({ propertiesCount, canManage }) => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'news.create.title' })
    const PropertyGateLabel = intl.formatMessage({ id: 'pages.hearth.news.index.propertyGate.header' })
    const PropertyGateMessage = intl.formatMessage({ id: 'pages.hearth.news.index.propertyGate.title' })
    const PropertyGateButtonLabel = intl.formatMessage({ id: 'pages.hearth.property.index.CreatePropertyButtonLabel' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} spaced/>
                <PageContent>
                    { propertiesCount !== 0 ?
                        <NewsForm actionName='create'/>
                        :
                        <EmptyListContent
                            image='/mascot/playing.webp'
                            label={PropertyGateLabel}
                            message={PropertyGateMessage}
                            createRoute='/property/create?next=/news/create&skipTourModal=true'
                            createLabel={PropertyGateButtonLabel}
                            accessCheck={canManage}
                        />
                    }
                </PageContent>
            </PageWrapper>
        </>
    )
}

const CreateNewsPage: PageComponentType = () => {
    const { canManage, isLoading: isAccessLoading } = useNewsItemsAccess()

    const intl = useIntl()
    const ServerErrorMsg = intl.formatMessage({ id: 'ServerError' })
    
    const { organization } = useOrganization()

    const {
        count: propertiesCount,
        loading: propertiesLoading,
        error: propertiesError,
    } = Property.useCount({ where: { organization: { id: get(organization, 'id') } }, first: 1 })

    const loading = isAccessLoading || propertiesLoading
    const error = propertiesError

    if (loading || error) {
        const errorToPrint = error ? ServerErrorMsg : null
        return <LoadingOrErrorPage loading={loading} error={errorToPrint}/>
    }

    if (isAccessLoading) {
        return <LoadingOrErrorPage error='' loading={true}/>
    }

    if (!canManage) {
        return <AccessDeniedPage/>
    }
    
    return <CreateNewsPageContent propertiesCount={propertiesCount} canManage={canManage} />
}

CreateNewsPage.requiredAccess = NewsReadAndManagePermissionRequired

export default CreateNewsPage
