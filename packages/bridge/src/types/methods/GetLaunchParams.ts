export type GetLaunchParamsParams = Record<string, never>

// TODO(HEARTH-5154): Add sign here to validate all this params
export type GetLaunchParamsData = {
    hearthUserId: string | null
    hearthUserType: 'staff' | 'resident'
    hearthContextEntity: 'Organization' | 'Resident'
    hearthContextEntityId: string | null
    hearthLocale: string
    hearthDeviceId: string
}