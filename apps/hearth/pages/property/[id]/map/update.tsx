import { Row, Col, RowProps } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useIntl } from '@open-hearth/next/intl'
import { Tour } from '@open-hearth/ui'

import { PageWrapper, PageContent } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'
import { CustomScrollbarCss } from '@hearth/domains/property/components/panels/Builder/BuildingPanelCommon'
import CreatePropertyMapForm from '@hearth/domains/property/components/PropertyMapForm/CreatePropertyMapForm'


const PAGE_ROW_GUTTER: RowProps['gutter'] = [0, 40]

const CreatePropertyMapPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.hearth.property.id.EditPropertyMapTitle' })
    const { query: { id } } = useRouter()

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <Row gutter={PAGE_ROW_GUTTER} css={CustomScrollbarCss}>
                        <Col span={24}>
                            <Tour.Provider>
                                <CreatePropertyMapForm id={id as string} />
                            </Tour.Provider>
                        </Col>
                    </Row>
                </PageContent>
            </PageWrapper>
        </>
    )
}

CreatePropertyMapPage.requiredAccess = OrganizationRequired

export default CreatePropertyMapPage
