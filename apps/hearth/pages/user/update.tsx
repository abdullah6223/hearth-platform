import Head from 'next/head'
import React from 'react'

import { useAuth } from '@open-hearth/next/auth'

import { AuthRequired } from '@hearth/domains/common/components/containers/AuthRequired'
import { PageContent, PageWrapper } from '@hearth/domains/common/components/containers/BaseLayout'
import { PageComponentType } from '@hearth/domains/common/types'
import { UserProfileForm } from '@hearth/domains/user/components/UserProfileForm'


export const UserInfoPage: PageComponentType = () => {
    const { user } = useAuth()
    const name = user?.name

    return (
        <>
            <Head>
                <title>{name}</title>
            </Head>
            <PageWrapper>
                <PageContent>
                    <UserProfileForm/>
                </PageContent>
            </PageWrapper>
        </>
    )
}

UserInfoPage.requiredAccess = AuthRequired

export default UserInfoPage
