import { useCheckPaymentsFilesExistenceQuery } from '@app/hearth/gql'

import { useIntl } from '@open-hearth/next/intl'
import { Typography } from '@open-hearth/ui'

import PaymentFilesTable from '@hearth/domains/acquiring/components/payments/PaymentFilesTable'
import { useBillingAndAcquiringContexts } from '@hearth/domains/billing/components/BillingPageContent/ContextProvider'
import { EmptyListContent } from '@hearth/domains/common/components/EmptyListContent'
import { Loader } from '@hearth/domains/common/components/Loader'


const SEARCHING_DINO_IMG = '/mascot/searching.webp'

const PaymentsFiles = (): JSX.Element => {
    const intl = useIntl()
    const NoPaymentsFilesTitle = intl.formatMessage({ id:'accrualsAndPayments.paymentsFiles.noPaymentsFilesYet.title' })
    const NoPaymentsFilesMessage = intl.formatMessage({ id:'accrualsAndPayments.paymentsFiles.noPaymentsFilesYet.message' })

    const { acquiringContexts } = useBillingAndAcquiringContexts()

    const {
        data: anyPaymentsFiles,
        error: anyPaymentsFilesError,
        loading: isAnyPaymentsFilesLoading,
    } = useCheckPaymentsFilesExistenceQuery({
        variables: {
            where: {
                context: { id_in: acquiringContexts.map(({ id }) => id) },
            },
        },
        skip: !acquiringContexts.length,
    })

    if (isAnyPaymentsFilesLoading) {
        return <Loader size='large' fill/>
    }

    if (anyPaymentsFilesError) {
        return <Typography.Title>{anyPaymentsFilesError.message}</Typography.Title>
    }

    if (!anyPaymentsFiles?.paymentsFiles?.length) {
        return (
            <EmptyListContent
                image={SEARCHING_DINO_IMG}
                label={NoPaymentsFilesTitle}
                message={NoPaymentsFilesMessage}
            />
        )
    }

    return <PaymentFilesTable />
}

export default PaymentsFiles

