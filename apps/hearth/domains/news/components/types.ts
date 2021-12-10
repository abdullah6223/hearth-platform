import { NewsItemScope } from '@app/hearth/schema'

export type NewsItemScopeNoInstanceType = Pick<NewsItemScope, 'property' | 'unitType' | 'unitName'>

export type TUnit = { unitType: string, unitName: string }
