import { Col, Row } from 'antd'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageComponentType } from '@hearth/domains/common/types'
import { PosterLayout } from '@hearth/domains/user/components/containers/PosterLayout'


const Src500 = { main: '/mascot/fail.webp' }

const Custom500: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage( { id: 'pages.hearth.error.PageTitle' })
    const DescriptionMessage = intl.formatMessage({ id: 'pages.hearth.error.Description' })

    return (
        <Row justify='space-between'>
            <Col span={24}>
                <Row gutter={[0, 24]} justify='center'>
                    <Col span={24}>
                        <Typography.Title>{PageTitle}</Typography.Title>
                    </Col>
                    <Col span={24}>
                        <Typography.Paragraph>
                            {DescriptionMessage}
                        </Typography.Paragraph>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const Error500Layout = (props): React.ReactElement => <PosterLayout
    {...props}
    image={Src500}
/>

Custom500.container = Error500Layout
Custom500.isError = true
Custom500.skipUserPrefetch = true

export default Custom500
