import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { EditContactForm } from '@hearth/domains/contact/components/EditContactForm'
import { ContactsReadAndManagePermissionRequired } from '@hearth/domains/contact/components/PageAccess'
import { prefetchContact } from '@hearth/domains/contact/utils/next/Contact'


const ContactUpdatePage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'EditingContact' })

    return (
        <>
            <Head>
                <title>
                    {PageTitle}
                </title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <EditContactForm/>
                </PageContent>
            </PageWrapper>
        </>
    )
}

ContactUpdatePage.requiredAccess = ContactsReadAndManagePermissionRequired

ContactUpdatePage.getPrefetchedData = async ({ context, apolloClient }) => {
    const { query } = context
    const { id: contactId } = query as { id: string }

    await prefetchContact({ client: apolloClient, contactId })

    return {
        props: {},
    }
}

export default ContactUpdatePage
