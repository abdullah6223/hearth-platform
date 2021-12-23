import getConfig from 'next/config'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Button, Space, Typography } from '@open-hearth/ui'

import { PageComponentType } from '@hearth/domains/common/types'
import { PosterLayout } from '@hearth/domains/user/components/containers/PosterLayout'


const SuccessSrc = { main: '/mascot/success.webp' }

const { publicRuntimeConfig:{ hearthRBDomain } } = getConfig()

const SuccessPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage( { id: 'pages.hearth.marketplace.invoice.payment.success.title' })
    const DescriptionMessage = intl.formatMessage({ id: 'pages.hearth.marketplace.invoice.payment.success.description' })
    const DownloadAppMessageButton = intl.formatMessage({ id: 'pages.hearth.marketplace.invoice.payment.success.downloadApp' })
    const CheckMessage = intl.formatMessage({ id: 'pages.hearth.marketplace.invoice.payment.success.check' })

    const router = useRouter()
    const { multiPaymentId } = router.query

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <Space direction='vertical' size={16}>
                <Typography.Title>{PageTitle}</Typography.Title>
                <Typography.Paragraph>
                    {DescriptionMessage}
                </Typography.Paragraph>
                {
                    multiPaymentId && (
                        <Typography.Link href={`${hearthRBDomain}/check/${multiPaymentId}`}>
                            <Button
                                key='submit'
                                type='primary'
                                block
                            >
                                {CheckMessage}
                            </Button>
                        </Typography.Link>
                    )
                }
                <Typography.Link href='https://onelink.to/hearth'>
                    <Button
                        key='submit'
                        type='secondary'
                        block
                    >
                        {DownloadAppMessageButton}
                    </Button>
                </Typography.Link>
            </Space>
        </>
    )
}

const SuccessPageLayout = (props): React.ReactElement => (
    <PosterLayout
        {...props}
        image={SuccessSrc}
    />
)

SuccessPage.container = SuccessPageLayout
SuccessPage.skipUserPrefetch = true

export default SuccessPage
