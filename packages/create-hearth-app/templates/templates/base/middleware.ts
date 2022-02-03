/**
 * Middleware to allow all requests from hearth through CORS
 */

import { NextRequest, NextResponse } from 'next/server'

const HEARTH_DOMAIN = process.env.NEXT_PUBLIC_HEARTH_DOMAIN || 'https://hearth.d.hearth.example.com'


const CORS_HEADERS = {
    'Access-Control-Allow-Origin': HEARTH_DOMAIN,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
}

export function middleware (request: NextRequest): NextResponse {
    const isPreflight = request.method === 'OPTIONS'



    if (isPreflight) {
        return NextResponse.json({}, { headers: CORS_HEADERS })
    }

    const response = NextResponse.next()

    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response
}

export const config = {
    runtime: 'nodejs',
}
