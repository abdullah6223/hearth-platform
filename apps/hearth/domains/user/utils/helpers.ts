import { normalizeEmail } from '@hearth/domains/common/utils/mail'
import { normalizePhone } from '@hearth/domains/common/utils/phone'


export function normalizeUserIdentifier (identifier: unknown): { type: 'phone' | 'email' | null, normalizedValue: string | null } {
    if (!identifier || typeof identifier !== 'string') return { type: null, normalizedValue: null }
    const phone = normalizePhone(identifier)
    if (phone) return { type: 'phone', normalizedValue: phone }
    const email = normalizeEmail(identifier)
    if (email) return { type: 'email', normalizedValue: email }
    return { type: null, normalizedValue: null }
}
