import get from 'lodash/get'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { usePreviousSortAndFilters } from '@hearth/domains/common/hooks/usePreviousQueryParams'
import { PageComponentType } from '@hearth/domains/common/types'
import { SettingsReadPermissionRequired } from '@hearth/domains/settings/components/PageAccess'
import {
    SettingsContent as TicketPropertyHintSettings,
} from '@hearth/domains/ticket/components/TicketPropertyHint/SettingsContent'


const PropertyHintsPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'Hint' })

    const { link }  = useOrganization()
    const employeeId = get(link, 'id')
    usePreviousSortAndFilters({ employeeSpecificKey: employeeId })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <TicketPropertyHintSettings />
                </PageContent>
            </PageWrapper>
        </>
    )
}

PropertyHintsPage.requiredAccess = SettingsReadPermissionRequired

export default PropertyHintsPage
