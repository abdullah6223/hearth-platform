import { BillingCategory, BillingReceipt } from '@app/hearth/schema'

export interface IFilters extends Pick<BillingReceipt, 'category'> {
    category?: BillingCategory
}