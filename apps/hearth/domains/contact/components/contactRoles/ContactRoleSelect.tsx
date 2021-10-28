import { ContactRole as IContactRole } from '@app/hearth/schema'
import { Select, SelectProps } from 'antd'
import React, { useMemo } from 'react'

import { ContactRole } from '@hearth/domains/contact/utils/clientSchema'

interface IEmployeeRoleSelectProps extends SelectProps<string> {
    roles: Array<IContactRole>
}

export const ContactRoleSelect: React.FC<IEmployeeRoleSelectProps> = (props) => {
    const { roles, ...restProps } = props
    const options = useMemo(() => roles.map((role) => {
        const convertedOption = ContactRole.convertGQLItemToFormSelectState(role)

        if (convertedOption) {
            const { value, label } = convertedOption
            return (<Select.Option key={value} value={value} title={label}>{label}</Select.Option>)
        }
    }), [roles])

    return (
        <Select
            allowClear={true}
            defaultValue={null}
            {...restProps}
        >
            {options}
        </Select>
    )
}
