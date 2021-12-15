import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { PageWrapper, PageContent } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { CatalogPageContent } from '@hearth/domains/miniapp/components/Catalog/PageContent'
import { ServicesReadPermissionRequired } from '@hearth/domains/miniapp/components/PageAccess'


const MiniappsCatalogPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'global.section.miniapps' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <CatalogPageContent/>
                </PageContent>
            </PageWrapper>
        </>
    )
}

MiniappsCatalogPage.requiredAccess = ServicesReadPermissionRequired

export default MiniappsCatalogPage
