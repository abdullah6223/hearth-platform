import { Organization } from '@app/hearth/schema'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { Sber } from '@open-hearth/icons'

import { useLayoutContext } from '@hearth/domains/common/components/LayoutContext'
import { colors } from '@hearth/domains/common/constants/style'
import { SBBOL_IMPORT_NAME } from '@hearth/domains/organization/integrations/sbbol/constants'

type SBBOLIndicatorProps = {
    organization: Pick<Organization, 'importId' | 'importRemoteSystem'>
}

export const SBBOLIndicator: React.FC<SBBOLIndicatorProps> = ({ organization }) => {
    const { breakpoints } = useLayoutContext()

    const importRemoteSystem = get(organization, 'importRemoteSystem')
    const importId = get(organization, 'importId')

    if (importRemoteSystem !== SBBOL_IMPORT_NAME || isEmpty(importId)) return null

    const size = breakpoints.TABLET_LARGE ? 'large' : 'small'

    return (
        <Sber color={colors.sberDarkGreen} size={size}/>
    )
}