import { TicketOrganizationSetting, TicketClassifier } from '@app/hearth/schema'
import React, { useEffect, useState } from 'react'


import { useCachePersistor } from '@open-hearth/apollo'

import { TicketOrganizationSetting as TicketSetting } from '@hearth/domains/ticket/utils/clientSchema'


type TicketFormContextType = {
    ticketSetting: TicketOrganizationSetting
    isAutoDetectedDeadlineValue: boolean
    setIsAutoDetectedDeadlineValue: React.Dispatch<React.SetStateAction<boolean>>
    ticketSettingLoading: boolean
    isExistedTicket: boolean
    setClassifier: React.Dispatch<React.SetStateAction<TicketClassifier>>
    classifier: TicketClassifier | null
}

export const TicketFormContext = React.createContext<TicketFormContextType>(null)

export const useTicketFormContext = (): TicketFormContextType => React.useContext(TicketFormContext)

export const TicketFormContextProvider = ({ children, organizationId, isExistedTicket }) => {
    const [isAutoDetectedDeadlineValue, setIsAutoDetectedDeadlineValue] = useState<boolean>(false)
    const [ticketSetting, setTicketSetting] = useState<TicketOrganizationSetting | null>(null)
    const [classifier, setClassifier] = useState<TicketClassifier | null>(null)
    const { persistor } = useCachePersistor()

    const { obj: newTicketSetting, loading: ticketSettingLoading } = TicketSetting.useObject({
        where: { organization: { id: organizationId } },
    }, { skip: !persistor || !organizationId })

    useEffect(() => {
        if (!newTicketSetting) return
        setTicketSetting(newTicketSetting)
    }, [newTicketSetting])

    return (
        <TicketFormContext.Provider
            value={{
                ticketSetting,
                ticketSettingLoading,
                isAutoDetectedDeadlineValue,
                setIsAutoDetectedDeadlineValue,
                isExistedTicket,
                classifier,
                setClassifier,
            }}
        >
            {children}
        </TicketFormContext.Provider>
    )
}
