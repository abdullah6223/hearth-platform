import React, { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'
import { Alert } from '@open-hearth/ui'

export const FormHintAlert = () => {
    const intl = useIntl()
    const AlertTitle = intl.formatMessage({ id: 'pages.hearth.settings.propertyScope.form.alert.message' })
    const AlertDescriptionMessage = intl.formatMessage({ id: 'pages.hearth.settings.propertyScope.form.alert.description' })
    const AlertDescriptionLink = intl.formatMessage({ id: 'pages.hearth.settings.propertyScope.form.alert.descriptionLink' })

    const AlertMessage = useMemo(() => (
        <Typography.Paragraph strong>
            {AlertTitle}
        </Typography.Paragraph>
    ), [AlertTitle])

    const AlertDescription = useMemo(() => (
        <>
            <Typography.Paragraph>
                {AlertDescriptionMessage}
            </Typography.Paragraph>
            <Typography.Link id='update-employee-hint-link' href='/employee' target='_blank'>
                <Typography.Text>
                    {AlertDescriptionLink}
                </Typography.Text>
            </Typography.Link>
        </>
    ), [AlertDescriptionLink, AlertDescriptionMessage])

    return (
        <Alert
            type='info'
            showIcon
            message={AlertMessage}
            description={AlertDescription}
        />
    )
}