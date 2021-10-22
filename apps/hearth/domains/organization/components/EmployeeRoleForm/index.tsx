import { OrganizationEmployeeRole as IEmployeeRole } from '@app/hearth/schema'
import React from 'react'

import { UseEmployeeRolesPermissionsGroups } from '@hearth/domains/organization/hooks/useEmployeeRolesPermissionsGroups'

import { CreateEmployeeRoleForm } from './CreateEmployeeRoleForm'
import { UpdateEmployeeRoleForm } from './UpdateEmployeeRoleForm'


type EmployeeRoleFormProps = {
    id?: IEmployeeRole['id']
    useEmployeeRolesPermissionsGroups?: UseEmployeeRolesPermissionsGroups
    withoutB2BApps?: boolean
}

export const EmployeeRoleForm: React.FC<EmployeeRoleFormProps> = ({ id, ...restProps }) => {
    return id ? <UpdateEmployeeRoleForm id={id} {...restProps} /> : <CreateEmployeeRoleForm {...restProps} />
}
