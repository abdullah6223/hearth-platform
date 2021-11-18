import { PermissionsRequired } from '@hearth/domains/organization/components/OrganizationRequired'

export const MeterReadPermissionRequired = ({ children }) => <PermissionsRequired permissionKeys={['canReadMeters']} children={children} />
export const MeterReadAndManagePermissionRequired = ({ children }) => <PermissionsRequired permissionKeys={['canReadMeters', 'canManageMeterReadings']} children={children} />
