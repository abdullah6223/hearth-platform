import get from 'lodash/get'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'

import { useAuth } from '@open-hearth/next/auth'
import { useIntl } from '@open-hearth/next/intl'
import { useOrganization } from '@open-hearth/next/organization'

import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import LoadingOrErrorPage from '@hearth/domains/common/components/containers/LoadingOrErrorPage'
import { MultipleFilterContextProvider } from '@hearth/domains/common/hooks/useMultipleFiltersModal'
import { PageComponentType } from '@hearth/domains/common/types'
import { MeterPageContent } from '@hearth/domains/meter/components/Meters/MeterPageContent'
import { MeterReportingPeriod, MeterResource, METER_TYPES, PropertyMeter } from '@hearth/domains/meter/utils/clientSchema'
import { getMeterTitleMessage } from '@hearth/domains/meter/utils/helpers'
import { OrganizationEmployee } from '@hearth/domains/organization/utils/clientSchema'


const PropertyMeterInfoPage: PageComponentType = () => {
    const intl = useIntl()
    const ServerErrorMessage = intl.formatMessage({ id: 'ServerError' })
    
    const { query: { id: meterId } } = useRouter()
    const { user } = useAuth()
    const { organization, selectEmployee } = useOrganization()

    const {
        obj: propertyMeter,
        error: propertyMeterError,
        loading: isPropertyMeterLoading,
        refetch,
    } = PropertyMeter.useObject({ where: { id: String(meterId) } })

    const propertyId = get(propertyMeter, 'property.id', null)
    const resourceId = get(propertyMeter, 'resource.id', null)
    const organizationId = get(propertyMeter, 'organization.id', null)

    const MeterTitleMessage = useMemo(() => getMeterTitleMessage(intl, propertyMeter), [propertyMeter])


    const {
        objs: possibleReportingPeriods,
        loading: isPeriodsLoading,
    } = MeterReportingPeriod.useObjects({ where: {
        OR: [
            { AND: [ { organization: { id: organizationId } }, { property: { id: propertyId } } ] },
            { AND: [ { organization: { id: organizationId } }, { property_is_null: true } ] },
        ],
    },
    })
    
    const {
        obj: meterResource,
        loading: isMeterResourceLoading,
    } = MeterResource.useObject({ where: { id: resourceId } })
    
    const userId = get(user, 'id', null)
    const meterOrganizationId = get(propertyMeter, 'organization.id', null)

    const {
        obj: meterOrganizationEmployee,
    } = OrganizationEmployee.useObject({
        where: {
            user: { id: userId },
            organization: { id: meterOrganizationId },
        },
    })

    const meterOrganizationEmployeeOrganizationId = get(meterOrganizationEmployee, 'organization.id')
    const currentEmployeeOrganization = get(organization, 'id')

    useEffect(() => {
        if (
            meterOrganizationEmployeeOrganizationId &&
            meterOrganizationEmployeeOrganizationId !== currentEmployeeOrganization
        ) {
            selectEmployee(meterOrganizationEmployee?.id)
        }
    }, [meterOrganizationEmployeeOrganizationId, currentEmployeeOrganization])


    if (!propertyMeter || isPropertyMeterLoading || isPeriodsLoading || isMeterResourceLoading) {
        return (
            <LoadingOrErrorPage
                loading={isPropertyMeterLoading || isPeriodsLoading || isMeterResourceLoading}
                error={propertyMeterError && ServerErrorMessage}
            />
        )
    }

    return (
        <MultipleFilterContextProvider>
            <Head>
                <title>{MeterTitleMessage}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <MeterPageContent
                        meter={propertyMeter}
                        possibleReportingPeriods={possibleReportingPeriods}
                        resource={meterResource}
                        refetchMeter={refetch}
                        meterType={METER_TYPES.property}
                    />
                </PageContent>
            </PageWrapper>
        </MultipleFilterContextProvider>
    )
}

// TODO(HEARTH-10641): add accessRequired for page

export default PropertyMeterInfoPage
