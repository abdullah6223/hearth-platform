import { Col, Row } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import get from 'lodash/get'
import React, { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Tag, Typography } from '@open-hearth/ui'
import { colors } from '@open-hearth/ui/colors'
import { useBreakpoints } from '@open-hearth/ui/dist/hooks'

import { PaymentsSumTable as RequisitesContainer } from '@hearth/domains/acquiring/components/payments/PaymentsSumTable'

import type { BankAccount as BankAccountType } from '@app/hearth/schema'


const GUTTER: [Gutter, Gutter] = [0, 20]
const valueAlign: React.CSSProperties = { textAlign: 'end' }
const renderRow = (name, value) => {
    return (
        <Row gutter={GUTTER}>
            <Col span={10}>
                <Typography.Text type='secondary' size='large'>{name}</Typography.Text>
            </Col>
            <Col span={14} style={valueAlign}>
                <Typography.Text type='secondary' size='large'>{value}</Typography.Text>
            </Col>
        </Row>
    )
}

export interface IBankAccountInfo {
    bankAccount: BankAccountType
}

export const BankingInfo: React.FC<IBankAccountInfo> = ({ bankAccount }) => {
    const intl = useIntl()
    const TinMessage = intl.formatMessage({ id: 'pages.hearth.settings.bankAccountInfo.tin' })
    const NumberMessage = intl.formatMessage({ id: 'pages.hearth.settings.bankAccountInfo.number' })
    const BicMessage = intl.formatMessage({ id: 'pages.hearth.settings.bankAccountInfo.bic' })
    const accrualsAndPayments = intl.formatMessage({ id: 'global.section.accrualsAndPayments' })

    const breakpoints = useBreakpoints()

    const containerStyle = useMemo(() => {
        return { width: breakpoints.MOBILE_SMALL && !breakpoints.DESKTOP_LARGE ? '100%' : '425px' }
    }, [breakpoints])

    // Note: could use just bankAccount.name after migrating organization names to empty bankAccount names
    const bankAccountName = useMemo(() => {
        const bankAccountName: string = get(bankAccount, 'name', '')
        const organizationName: string = get(bankAccount, 'organization.name', '-')
        if (bankAccountName) {
            return bankAccountName
        }
        return organizationName
    }, [bankAccount])

    return (
        <RequisitesContainer style={containerStyle}>
            <Row gutter={[0, 22]}>
                <Col span={24}>
                    <Tag
                        bgColor={ colors.gray[7]}
                        textColor={colors.white}
                    >
                        {accrualsAndPayments}
                    </Tag>
                </Col>
                <Col span={24}>
                    <Typography.Title level={3}>{bankAccountName}</Typography.Title>
                </Col>
                <Row gutter={GUTTER}>
                    <Col span={24}>
                        {renderRow(BicMessage, get(bankAccount, 'routingNumber', '-'))}
                    </Col>
                    <Col span={24}>
                        {renderRow(TinMessage, get(bankAccount, 'tin', '-'))}
                    </Col>
                    <Col span={24}>
                        {renderRow(NumberMessage, get(bankAccount, 'number', '-'))}
                    </Col>
                </Row>
            </Row>
        </RequisitesContainer>
    )
}
