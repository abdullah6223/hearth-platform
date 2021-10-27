import React from 'react'

import { Building } from '@open-hearth/icons'
import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import { FormItemTooltipWrapper } from '@hearth/domains/common/components/Form/FormItemTooltipWrapper'
import { LinkWithIcon } from '@hearth/domains/common/components/LinkWithIcon'


export const PropertyFormItemTooltip = () => {
    const intl = useIntl()
    const PropertyFormItemTooltipTitle = intl.formatMessage({ id: 'field.Property.tooltip.title' })
    const PropertyFormItemTooltipLink = intl.formatMessage({ id: 'field.Property.tooltip.link' })

    return (
        <FormItemTooltipWrapper>
            <Typography.Text size='small'>
                {PropertyFormItemTooltipTitle}
            </Typography.Text>
            <LinkWithIcon
                href='/property'
                title={PropertyFormItemTooltipLink}
                size='medium'
                PostfixIcon={Building}
                target='_blank'
            />
        </FormItemTooltipWrapper>
    )
}