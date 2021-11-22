const { AccountResolver } = require('@hearth/domains/billing/schema/resolvers/accountResolver')
const { CategoryResolver } = require('@hearth/domains/billing/schema/resolvers/categoryResolver')
const { PeriodResolver } = require('@hearth/domains/billing/schema/resolvers/periodResolver')
const { PropertyResolver } = require('@hearth/domains/billing/schema/resolvers/propertyResolver')
const { ReceiptResolver } = require('@hearth/domains/billing/schema/resolvers/receiptResolver')
const { RecipientResolver } = require('@hearth/domains/billing/schema/resolvers/recipientResolver')


module.exports = {
    AccountResolver,
    CategoryResolver,
    PeriodResolver,
    PropertyResolver,
    RecipientResolver,
    ReceiptResolver,
}