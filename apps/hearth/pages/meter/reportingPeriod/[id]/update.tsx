import { Col, Row, RowProps } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { PageComponentType } from '@hearth/domains/common/types'
import { MeterReportingPeriodForm } from '@hearth/domains/meter/components/MeterReportingPeriodForm'
import { MeterReadAndManagePermissionRequired } from '@hearth/domains/meter/components/PageAccess'
import { METER_TAB_TYPES, MeterReportingPeriod, METER_TYPES } from '@hearth/domains/meter/utils/clientSchema'


const CREATE_REPORTING_PERIOD_PAGE_GUTTER: RowProps['gutter'] = [0, 16]

const MeterReportingPeriodUpdatePage: PageComponentType = () => {
    const intl = useIntl()
    const { query: { id: reportingPeriodId }, push } = useRouter()

    const PageTitle = intl.formatMessage({ id: 'meter.reportingPeriod.EditMeterReportingPeriod' })
    const NotFoundMsg = intl.formatMessage({ id: 'NotFound' })
    const ServerErrorMsg = intl.formatMessage({ id: 'ServerError' })
    const DescriptionMessage = intl.formatMessage({ id: 'pages.hearth.meter.reportingPeriod.create.descriptionMessage' })

    const {
        obj: reportingPeriod,
        error: reportingPeriodError,
        loading: reportingPeriodLoading,
    } = MeterReportingPeriod.useObject(
        {
            where: {
                id: String(reportingPeriodId),
            },
        })

    const action = MeterReportingPeriod.useUpdate({})
    const submitAction = async (data) => {
        await action(data, reportingPeriod)
        await push(`/meter?tab=${METER_TAB_TYPES.reportingPeriod}&type=${METER_TYPES.unit}`)
    }
    
    const isNotFound = !reportingPeriodLoading && (!reportingPeriod)
    if (reportingPeriodError || reportingPeriodLoading || isNotFound) {
        const errorToPrint = reportingPeriodError ? ServerErrorMsg : isNotFound ? NotFoundMsg : null
        return <LoadingOrErrorPage loading={reportingPeriodLoading} error={errorToPrint}/>
    }
    return <>
        <Head>
            <title>{PageTitle}</title>
        </Head>
        <PageWrapper>
            <PageContent>
                <Row gutter={[0, 60]}>
                    <Col span={24}>
                        <Row gutter={CREATE_REPORTING_PERIOD_PAGE_GUTTER}>
                            <Typography.Title level={1}>{PageTitle}</Typography.Title>
                            <Typography.Text type='secondary'>
                                {DescriptionMessage}
                            </Typography.Text>
                        </Row>
                    </Col>
                
                    <Col span={24}>
                        <Row gutter={CREATE_REPORTING_PERIOD_PAGE_GUTTER}>
                            <MeterReportingPeriodForm
                                mode='update'
                                action={submitAction}
                                reportingPeriodRecord={reportingPeriod}
                            />
                        </Row>
                    </Col>
                </Row>
            </PageContent>
        </PageWrapper>
    </>
}

MeterReportingPeriodUpdatePage.requiredAccess = MeterReadAndManagePermissionRequired

export default MeterReportingPeriodUpdatePage
