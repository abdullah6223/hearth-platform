import { useGetTicketStatusesQuery } from '@app/hearth/gql'
import { Organization, OrganizationEmployee } from '@app/hearth/schema'

import { useCachePersistor } from '@open-hearth/apollo'

import { getPossibleStatuses } from '../utils/status'

export const useStatusTransitions = (ticketStatusId: string, organization: Organization, employee: OrganizationEmployee) => {
    const { persistor } = useCachePersistor()

    const {
        data: ticketStatusesData,
        loading: ticketStatusesLoading,
    } = useGetTicketStatusesQuery({
        skip: !persistor,
    })
    const statusList = ticketStatusesData?.statuses.filter(Boolean) || []

    const organizationStatusTransition = organization?.statusTransitions || null
    const employeeRoleStatusTransitions = employee?.role?.statusTransitions || null

    return {
        loading: ticketStatusesLoading,
        statuses:  getPossibleStatuses(
            statusList,
            ticketStatusId,
            organizationStatusTransition,
            employeeRoleStatusTransitions,
        ),
    }
}