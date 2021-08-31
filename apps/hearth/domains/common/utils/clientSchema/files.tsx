import React from 'react'

import { DocIcon } from '@hearth/domains/common/components/icons/DocIcon'
import { ImageIcon } from '@hearth/domains/common/components/icons/ImageIcon'
import { VideoIcon } from '@hearth/domains/common/components/icons/VideoIcon'

export const getIconByMimetype = (mimetype) => {
    if (mimetype.startsWith('image')) return <ImageIcon />
    if (mimetype.startsWith('video')) return <VideoIcon />

    return <DocIcon />
}