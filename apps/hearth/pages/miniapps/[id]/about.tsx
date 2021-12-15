import Error from 'next/error'
import { useRouter } from 'next/router'
import React from 'react'

import { PageComponentType } from '@hearth/domains/common/types'
import { isSafeUrl } from '@hearth/domains/common/utils/url.utils'
import { B2BAppPage } from '@hearth/domains/miniapp/components/AppDescription'
import { ServicesReadPermissionRequired } from '@hearth/domains/miniapp/components/PageAccess'


const MiniappDescriptionPage: PageComponentType = () => {
    const { query: { id } } = useRouter()

    if (Array.isArray(id) || !id || !isSafeUrl(id)) return <Error statusCode={404}/>

    return <B2BAppPage id={id}/>
}

MiniappDescriptionPage.requiredAccess = ServicesReadPermissionRequired

export default MiniappDescriptionPage
