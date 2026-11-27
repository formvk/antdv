import type { TableModel } from '@formvk/models'
import { Space, Tag } from 'antdv-next'
import { h } from 'vue'
import type { VNodeChild } from 'vue'

import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { ITree, RenderProps } from './types'
import { findOption, renderPlaceholder } from './utils'

export interface TagRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Row extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: VNodeChild
  /** 选项数据源，数组项可携带 `color` 等 Tag 属性 */
  options: ITree<Record<string, any>>[] | ((props: RenderProps<Model, Scope, any, Row>) => ITree<Record<string, any>>[])
  /** 树形选项只显示最后一级，默认 `true` */
  last?: boolean
}

/** 枚举标签渲染：把值渲染为 Tag */
export function tag<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Row extends object = Model['records'][number],
>(_config: TagRenderOptions<Model, Scope, Row> | TagRenderOptions<Model, Scope, Row>['options']) {
  const config = Array.isArray(_config) || typeof _config === 'function' ? { options: _config } : _config
  const { last = true } = config

  return createRender<Model, Scope, any, Row>(props => {
    const placeholder = useTablePlaceholder(config.placeholder)
    const dataSource = typeof config.options === 'function' ? config.options(props) : config.options
    const chain = findOption(dataSource, props.text)

    if (!chain.length) {
      return renderPlaceholder(props.text, placeholder.value)
    }

    if (last) {
      const { label, value: _value, children: _children, type: _type, ...rest } = chain[chain.length - 1]
      return h(Tag, rest, { default: () => renderPlaceholder(label, placeholder.value) })
    }

    return h(
      Space,
      {},
      {
        default: () =>
          chain.map((item, index) => {
            const { label, value, children: _children, type: _type, ...rest } = item
            return h(Tag, { ...rest, key: String(value ?? index) }, { default: () => label })
          }),
      }
    )
  })
}
