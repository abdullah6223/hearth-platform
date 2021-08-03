import { List as DefaultList } from 'antd'
import React, { useMemo } from 'react'


import { Typography } from '@open-hearth/ui/src'
import type { TypographyTextProps } from '@open-hearth/ui/src'

import type { ListProps as DefaultListProps } from 'antd'
import type { ListItemProps as DefaultListItemProps } from 'antd/lib/list'

const LIST_CLASS_PREFIX = 'hearth-list'
const ELLIPSIS_WORD_LENGTH = 80

type ListDataSource = { label: string, value: string, valueTextType?: TypographyTextProps['type'], valueClick?: () => void }

type HearthListProps = {
    title?: string
}

export type ListProps = Omit<DefaultListProps<ListDataSource>, 'bordered' | 'pagination' | 'footer' | 'renderItem' | 'header'> & HearthListProps

const DefaultListItem = DefaultList.Item

type HearthListItemProps = {
    item: ListDataSource
}
type ListItemProps = Pick<DefaultListItemProps, 'className' | 'prefixCls' | 'colStyle'> & HearthListItemProps

interface IListItem {
    (props: ListItemProps): React.ReactElement
}

const ListItem: IListItem = (props) => {
    const { item: { label, value, valueTextType, valueClick }, ...restProps } = props

    const labelEllipsis = useMemo(() => {
        return label.length > ELLIPSIS_WORD_LENGTH ? { tooltip: { children: label } } : false
    }, [label])
    const valueEllipsis = useMemo(() => {
        return value.length > ELLIPSIS_WORD_LENGTH ? { tooltip: { children: value } } : false
    }, [value])

    return (
        <DefaultListItem {...restProps} prefixCls={LIST_CLASS_PREFIX}>
            <>
                <Typography.Text ellipsis={labelEllipsis} type='secondary'>
                    {label}
                </Typography.Text>
                <div className='hearth-list-item-divider'></div>
                <Typography.Text ellipsis={valueEllipsis} type={valueTextType} onClick={valueClick}>
                    {value}
                </Typography.Text>
            </>
        </DefaultListItem>
    )
}

const List: React.FC<ListProps> = (props) => {
    const { children, title, ...restProps } = props

    return (
        <DefaultList
            {...restProps}
            header={title ? <Typography.Title level={3}>{title}</Typography.Title> : null}
            prefixCls={LIST_CLASS_PREFIX}
            bordered={false}
            renderItem={(item, key) => (
                <ListItem key={`${LIST_CLASS_PREFIX}-item-${key}`} item={item} />
            )}
        >
            {children}
        </DefaultList>
    )
}

List.displayName = 'List'

export {
    List,
}
