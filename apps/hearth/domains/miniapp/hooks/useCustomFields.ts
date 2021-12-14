
import { useGetCustomValuesForObjectQuery } from '@app/hearth/gql'
import { CustomFieldModelNameType } from '@app/hearth/schema'

type UseCustomValuesProps = {
    modelName: CustomFieldModelNameType
    objectId: string
    skip?: boolean
}

export function useCustomValues ({
    modelName,
    objectId,
    skip = false,
}: UseCustomValuesProps) {
    const {
        loading,
        error,
        data,
        refetch,
    } = useGetCustomValuesForObjectQuery({
        variables: {
            modelName: modelName,
            itemId: objectId,
        },
        skip: skip || !objectId,
    })

    const customValues = data?.customValues || []

    return {
        loading,
        error,
        data,
        customValues,
        refetch,
    }
}
