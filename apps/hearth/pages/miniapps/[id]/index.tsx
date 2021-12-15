import Error from 'next/error'
import { useRouter } from 'next/router'
import React from 'react'

import { PageComponentType } from '@hearth/domains/common/types'
import { isSafeUrl } from '@hearth/domains/common/utils/url.utils'
import { B2BAppPage } from '@hearth/domains/miniapp/components/AppIndex'
import { OrganizationRequired } from '@hearth/domains/organization/components/OrganizationRequired'


const MiniAppIndexPage: PageComponentType = () => {
    const { query: { id } } = useRouter()

    if (Array.isArray(id) || !id || !isSafeUrl(id)) {
        return <Error statusCode={404}/>
    }

    return <B2BAppPage id={id}/>
}

MiniAppIndexPage.requiredAccess = OrganizationRequired

export default MiniAppIndexPage
