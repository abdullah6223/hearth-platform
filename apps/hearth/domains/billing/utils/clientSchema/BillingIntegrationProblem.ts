import { generateReactHooks } from '@open-hearth/codegen/generate.hooks'

import { BillingIntegrationProblem as BillingIntegrationProblemGQL } from '@hearth/domains/billing/gql'

import type {
    BillingIntegrationProblem,
    BillingIntegrationProblemCreateInput,
    BillingIntegrationProblemsUpdateInput,
    QueryAllBillingIntegrationProblemsArgs,
} from '@app/hearth/schema'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<BillingIntegrationProblem, BillingIntegrationProblemCreateInput, BillingIntegrationProblemsUpdateInput, QueryAllBillingIntegrationProblemsArgs>(BillingIntegrationProblemGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
