import React from 'react'

import * as hearthIcons from '@open-hearth/icons'
import { Tag as Component } from '@open-hearth/ui/src'
import { colors } from '@open-hearth/ui/src/colors'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const icons = Object.assign(
    {},
    ...Object.entries(hearthIcons).map(([key, Icon]) => ({
        [`${key}-small`]: <Icon size='small' />,
    })),
)

export default {
    title: 'Components/Tag',
    component: Component,
    args: {
        children: 'Label',
        textColor: colors.gray['7'],
        bgColor: colors.gray['1'],
    },
    argTypes: {
        icon: {
            options: Object.keys(icons),
            mapping: icons,
            control: {
                type: 'select',
            },
        },
        iconPosition: {
            control: { type: 'select' },
            options: ['start', 'end'],
        },
    },
} as Meta<typeof Component>

export const Tag: StoryObj<typeof Component> = {}

export const TagWithIcon: StoryObj<typeof Component> = {
    args: {
        icon: icons['ChevronDown-small'],
        iconPosition: 'end',
    },
}
