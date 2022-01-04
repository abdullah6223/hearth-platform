import { Col, Row } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import Head from 'next/head'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import {
    MarketSettingPaymentTypesCard,
} from '@hearth/domains/marketplace/components/MarketSetting/MarketSettingPaymentTypesCard'
import { MarketSettingReadPermissionRequired } from '@hearth/domains/settings/components/PageAccess'


const ROW_GUTTER: [Gutter, Gutter] = [0, 60]

const MarketplaceSettingsContent: React.FC = () => {
    return (
        <>
            <Col span={12}>
                <Row gutter={ROW_GUTTER}>
                    <MarketSettingPaymentTypesCard/>
                </Row>
            </Col>
        </>
    )
}

const MarketplaceSettingsPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'global.section.marketplace' })

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageContent>
                <MarketplaceSettingsContent />
            </PageContent>
        </>
    )
}

MarketplaceSettingsPage.requiredAccess = MarketSettingReadPermissionRequired

export default MarketplaceSettingsPage
