import get from 'lodash/get'
import React, { useMemo } from 'react'

import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'
import { ActionBar, Button } from '@open-hearth/ui'

import { PropertyScope } from '@hearth/domains/scope/utils/clientSchema'

import { BasePropertyScopeForm } from './BasePropertyScopeForm'


export const CreatePropertyScopeForm = () => {
    const intl = useIntl()
    const SaveLabel = intl.formatMessage({ id: 'Save' })

    const { organization } = useOrganization()
    const action = PropertyScope.useCreate({ organization: { connect: { id: organization.id } } })

    const organizationId = useMemo(() => get(organization, 'id'), [organization])

    return (
        <BasePropertyScopeForm
            action={action}
            organizationId={organizationId}
        >
            {({ handleSave, isLoading }) => (
                <ActionBar
                    actions={[
                        <Button
                            key='submit'
                            onClick={handleSave}
                            type='primary'
                            loading={isLoading}
                            id='PropertyScopeClickCreate'
                        >
                            {SaveLabel}
                        </Button>,
                    ]}
                />
            )}
        </BasePropertyScopeForm>
    )
}