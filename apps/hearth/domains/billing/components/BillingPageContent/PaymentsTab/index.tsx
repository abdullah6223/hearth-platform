import { VIEW_TYPES, ViewTypes } from '@hearth/domains/acquiring/utils/clientSchema'
import Payments from '@hearth/domains/billing/components/BillingPageContent/PaymentsTab/Payments'
import PaymentsFiles from '@hearth/domains/billing/components/BillingPageContent/PaymentsTab/PaymentsFiles'

interface PaymentsTabProps {
    type: ViewTypes
}

export const PaymentsTab = ({ type }: PaymentsTabProps): JSX.Element => {
    if (type === VIEW_TYPES.registry) {
        return <PaymentsFiles />
    }

    return <Payments />
}
