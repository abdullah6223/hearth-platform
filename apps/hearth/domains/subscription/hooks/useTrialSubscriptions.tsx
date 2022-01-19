import { useGetOrganizationTrialSubscriptionsQuery } from '@app/hearth/gql'

import { useOrganization } from '@open-hearth/next/organization'

export const useTrialSubscriptions = () => {
    const { organization } = useOrganization()

    const {
        data: trialSubscriptionsData,
        loading: trialSubscriptionsLoading,
        refetch: refetchTrialSubscriptions,
    } = useGetOrganizationTrialSubscriptionsQuery({
        variables: {
            organizationId: organization?.id,
        },
        skip: !organization?.id,
    })

    const trialSubscriptions = trialSubscriptionsData?.trialSubscriptions || []

    return {
        trialSubscriptions,
        isLoading: trialSubscriptionsLoading,
        refetch: refetchTrialSubscriptions,
    }
}
