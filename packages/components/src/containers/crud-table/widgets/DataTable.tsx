import type { IPagination, TableModel } from '@formvk/models'
import type { Stringify } from '@formvk/schema'
import { Table } from 'antdv-next'
import type { TableProps } from 'antdv-next'
import { computed, defineComponent, onMounted } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { TableRenderProvider, usePrefixCls, useTableModel, useTableRenderContext, useTableScope } from '../../../hooks'
import { cls } from '../../../shared'
import type { ColumnRender } from '../../renders/types'
import { useStyle } from '../style'

type ColumnsType<RecordType = any> = NonNullable<TableProps<RecordType>['columns']>

/** 单元格取值：支持 `a.b` 形式的多层路径 */
function getCellValue(record: Record<string, any>, prop?: string) {
  if (!prop) return undefined
  return prop.split('.').reduce<any>((value, key) => value?.[key], record)
}

/** 分页配置，`false` 关闭分页 */
export type DataTablePagination = Partial<IPagination> & {
  /** 是否显示每页条数切换，默认 `true` */
  showSizeChanger?: boolean
  /** 每页条数选项，默认 `[10, 20, 50, 100]` */
  pageSizeOptions?: (string | number)[]
  [key: string]: any
}

/** 表格列配置，字段会转换成 antd 的 ColumnsType，支持 `{{ }}` 表达式 */
export interface DataTableColumn<IRecord extends object = any> {
  /** 列标题 */
  label?: string
  /** 列标题（antd 原生字段） */
  title?: string
  /** 字段名，支持 `a.b` 形式的多层路径 */
  prop?: string
  /** 字段名（antd 原生字段） */
  dataIndex?: string | string[]
  /** 列宽 */
  width?: string | number
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean | 'custom'
  /** 内容溢出时省略 */
  ellipsis?: boolean
  /** 自定义单元格渲染函数，签名与 renders 渲染器一致 */
  render?: ColumnRender<IRecord>
  /** 单元格格式化，签名与 `render` 一致 */
  formatter?: ColumnRender<IRecord>
  /** 嵌套子列 */
  children?: DataTableColumn<IRecord>[]
  /** 其他 antd 列属性 */
  [key: string]: any
}

export interface DataTableProps<IRecord extends object = any> {
  /** 列配置，支持 `{{ }}` 表达式 */
  columns?: Stringify<DataTableColumn<IRecord>>[]
  /** 分页配置，默认使用模型分页；传 `false` 关闭分页 */
  pagination?: false | DataTablePagination
  /** 表达式作用域，会与上下文 scope、`$table`、`$state` 合并 */
  scope?: Record<string, unknown>
  /** 单元格空值占位符，供渲染器使用，默认继承上下文 */
  placeholder?: VNodeChild
}

/** 把库内的列配置转换为 antd 表格列 */
function normalizeColumn<IRecord extends object>(
  column: DataTableColumn<IRecord>,
  key: string | number
): Record<string, any> {
  const { render, formatter, children, label, prop, title, dataIndex, sortable, fixed, ...rest } = column

  const path = prop ?? (typeof dataIndex === 'string' ? dataIndex : undefined)
  const cellRender = render ?? formatter
  const normalized: Record<string, any> = {
    ...rest,
    key: (column.columnKey as string) ?? path ?? key,
    dataIndex,
    title: title ?? label,
  }

  // 兼容 `prop` 写法
  if (normalized.dataIndex === undefined && prop) {
    normalized.dataIndex = prop
  }
  // 兼容 `sortable` 简写
  if (normalized.sorter === undefined && sortable !== undefined) {
    normalized.sorter = sortable === 'custom' ? true : sortable
  }
  if (normalized.ellipsis === undefined && column.showOverflowTooltip) {
    normalized.ellipsis = true
  }
  if (fixed === true) {
    normalized.fixed = 'left'
  } else if (fixed !== undefined) {
    normalized.fixed = fixed
  }
  if (cellRender) {
    // antdv-next 的表格列使用 `render`（而非 antd React 的 `customRender`）
    normalized.render = (value: any, record: any, index: number) => {
      return cellRender(path ? getCellValue(record, path) : value, record, index)
    }
  }
  if (children?.length) {
    normalized.children = children.map((child, i) => normalizeColumn(child, `${normalized.key}-${i}`))
  }
  return normalized
}

/**
 * 表格模型驱动的表格：分页、加载态与列表达式由模型接管。
 * 列配置使用 `columns`，单元格展示配合 `renders` 渲染器使用
 */
export const DataTable = defineComponent<DataTableProps>({
  name: 'DataTable',
  inheritAttrs: false,
  props: {
    columns: Array as PropType<DataTableProps['columns']>,
    pagination: { type: [Boolean, Object] as PropType<false | DataTablePagination>, default: undefined },
    scope: Object as PropType<Record<string, unknown>>,
    placeholder: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  setup(props, { attrs }) {
    const table = useTableModel<TableModel>()
    const context = useTableRenderContext<TableModel>()
    const expressionScope = useTableScope(props.scope)
    const prefixCls = usePrefixCls('crud-table')
    const hashId = useStyle(prefixCls)

    onMounted(() => table.onMount())

    const columns = computed<ColumnsType<any>>(() => {
      if (!props.columns?.length) return []
      return table
        .compile<DataTableColumn>(props.columns, expressionScope.value)
        .map((column, index) => normalizeColumn(column, index))
    })

    const pagination = computed(() => {
      if (props.pagination === false) return false
      const config = props.pagination && typeof props.pagination === 'object' ? props.pagination : null
      const { layout: _layout, pageSizes, ...rest } = (config ?? {}) as Record<string, any>
      return {
        showSizeChanger: true,
        pageSizeOptions: pageSizes ?? ['10', '20', '50', '100'],
        ...rest,
        ...table.pagination,
      }
    })

    const renderContext = computed(() => ({
      ...context.value,
      placeholder: props.placeholder ?? context.value.placeholder,
      scope: expressionScope.value,
    }))

    return () => {
      const { class: className, onChange: attrsOnChange, ...tableAttrs } = attrs as Record<string, any>
      return (
        <TableRenderProvider value={renderContext.value}>
          <Table
            {...tableAttrs}
            loading={table.form.submitting}
            dataSource={table.records}
            columns={columns.value}
            pagination={pagination.value}
            class={cls((className as string) ?? prefixCls, hashId.value)}
            onChange={(nextPagination: any, filters: any, sorter: any, extra: any) => {
              attrsOnChange?.(nextPagination, filters, sorter, extra)
              table.onSearch({
                current: nextPagination?.current ?? table.pagination.current,
                pageSize: nextPagination?.pageSize ?? table.pagination.pageSize,
                total: nextPagination?.total ?? table.pagination.total,
              })
            }}
          />
        </TableRenderProvider>
      )
    }
  },
})
