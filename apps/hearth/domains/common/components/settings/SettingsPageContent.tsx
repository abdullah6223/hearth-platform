import React from 'react'

import { TabItem } from '@open-hearth/ui'

import { TabsPageContent } from '@hearth/domains/common/components/TabsPageContent'


type PageContentProps = {
    settingsTabs: TabItem[]
    availableTabs: string[]
}

// TODO(HEARTH-12166): use TabsPageContent instead of SettingsPageContent and remove SettingsPageContent
export const SettingsPageContent: React.FC<PageContentProps> = ({ settingsTabs, availableTabs }) => {
    return <TabsPageContent
        tabItems={settingsTabs}
        availableTabs={availableTabs}
    />
}
