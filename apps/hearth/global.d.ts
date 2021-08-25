import { GetActiveOrganizationEmployeeQuery, AuthenticatedUserQuery } from '@app/hearth/gql'
import enCustom from '@app/hearth/lang/en/en.custom.json'
import en from '@app/hearth/lang/en/en.json'
import esCustom from '@app/hearth/lang/es/es.custom.json'
import es from '@app/hearth/lang/es/es.json'
import ruCustom from '@app/hearth/lang/ru/ru.custom.json'
import ru from '@app/hearth/lang/ru/ru.json'
import React from 'react'


// NOTE: Combine all keys together
const translations = [en, ru, es] as const
const customTranslations = [enCustom, ruCustom, esCustom] as const

type TranslationsKeysType = keyof typeof translations[number]
type CustomTranslationsKeysType = keyof typeof customTranslations[number]
type MessagesKeysType = TranslationsKeysType | CustomTranslationsKeysType

type LinkExtendsType = GetActiveOrganizationEmployeeQuery['employees'][number]
type OrganizationExtendsType = GetActiveOrganizationEmployeeQuery['employees'][number]['organization']
type EmployeeExtendsType = Omit<GetActiveOrganizationEmployeeQuery['employees'][number], 'organization' | 'role'>
type RoleExtendsType = GetActiveOrganizationEmployeeQuery['employees'][number]['role']
type UserExtendsType = AuthenticatedUserQuery['authenticatedUser']

declare global {
    // NOTE: Override global interface allows us to use autocomplete in intl
    namespace FormatjsIntl {
        interface Message {
            ids: MessagesKeysType
        }
    }

    // NOTE: Override global interface allows us to use autocomplete in useOrganization/useAuth from '@open-hearth/next'
    namespace OpenHearthNext {
        interface GetActiveOrganizationEmployeeQueryType extends GetActiveOrganizationEmployeeQuery {}
        interface LinkType extends LinkExtendsType {}
        interface OrganizationType extends OrganizationExtendsType {}
        interface EmployeeType extends EmployeeExtendsType {}
        interface RoleType extends RoleExtendsType {}
        interface UserType extends UserExtendsType {}
    }
}

declare module '@ant-design/icons/lib/components/Icon' {
    interface IconBaseProps extends React.HTMLProps<HTMLSpanElement> {
        spin?: boolean
        rotate?: number
    }
}
