import type { ArrayField, FieldDisplayTypes, GeneralField } from '@formvk/core'
import type { Schema } from '@formvk/schema'
import { isArr, isBool, isFn } from '@formvk/shared'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { Pagination, Table } from 'antdv-next'
import type { TableProps } from 'antdv-next'
import SortableJS from 'sortablejs'
import type { InjectionKey } from 'vue'
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import type { PropType } from 'vue'

import { cls, isComponentOf, usePrefixCls } from '../../shared'
import { Addition, ArrayBase, ArrayBaseItem, useArray } from '../array-base'
import type { IAdditionProps } from '../array-base'
import { useStyle } from './style'

interface ObservableColumnSource {
  field?: GeneralField
  columnProps: Record<string, any>
  schema: Schema
  display?: FieldDisplayTypes
  name: string
}

interface PaginationAction {
  totalPage?: number
  pageSize?: number
  startIndex?: number
  changePage?: (page: number) => void
}

const ArrayTablePaginationContext: InjectionKey<PaginationAction> = Symbol('FormvkArrayTablePaginationContext')

const isColumnComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Column')
}

const isOperationsComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Operations')
}

const isAdditionComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Addition')
}

const indexKey = '__DO_NOT_USE_THIS_PROPERTY_index__'

const useArrayTableSources = () => {
  const arrayField = useField()
  const schema = useFieldSchema()

  const parseSources = (columnSchema: Schema): ObservableColumnSource[] => {
    if (isColumnComponent(columnSchema) || isOperationsComponent(columnSchema) || isAdditionComponent(columnSchema)) {
      if (!columnSchema.componentProps?.['dataIndex'] && !columnSchema['name']) return []
      const name = columnSchema.componentProps?.['dataIndex'] || columnSchema['name']
      const field = arrayField.value?.query(arrayField.value.address.concat(name)).take()
      const columnProps = (field?.component as any[] | undefined)?.[1] || columnSchema.componentProps || {}
      const display = field?.display || columnSchema.display
      return [
        {
          name,
          display,
          field,
          schema: columnSchema,
          columnProps,
        },
      ]
    } else if (columnSchema.properties) {
      return columnSchema.reduceProperties<ObservableColumnSource[], ObservableColumnSource[]>(
        (buf, propertySchema) => {
          return buf.concat(parseSources(propertySchema))
        },
        []
      )
    }
    return []
  }

  const parseArrayItems = (schemaItems: Schema['items']) => {
    if (!schemaItems) return []
    const sources: ObservableColumnSource[] = []
    const items = isArr(schemaItems) ? schemaItems : [schemaItems]
    return items.reduce((columns, itemSchema) => {
      const item = parseSources(itemSchema)
      if (item) {
        return columns.concat(item)
      }
      return columns
    }, sources)
  }

  return computed(() => {
    if (!schema.value) throw new Error('can not found schema object')
    return parseArrayItems(schema.value.items)
  })
}

const useAddition = () => {
  const schema = useFieldSchema()
  return computed(() =>
    schema.value?.reduceProperties((sum, propertySchema, key) => {
      if (isAdditionComponent(propertySchema)) {
        return <RecursionField schema={propertySchema} name={key} />
      }
      return sum
    }, null)
  )
}

export const ArrayTable = defineComponent<
  Omit<TableProps, 'dataSource' | 'pagination'> & {
    pagination?: boolean | Record<string, any>
    prefixCls?: string
  }
>({
  name: 'ArrayTable',
  inheritAttrs: false,
  props: {
    pagination: {
      type: [Boolean, Object] as PropType<boolean | Record<string, any>>,
      default: true,
    },
    prefixCls: String,
  },
  setup(props, { attrs, slots }) {
    const field = useField<ArrayField>()
    const prefixCls = usePrefixCls('array-table', props)
    const hashId = useStyle(prefixCls)
    const basePrefixCls = usePrefixCls()
    const sources = useArrayTableSources()
    const addition = useAddition()
    const tableRef = ref<any>()
    let sortable: SortableJS | null = null

    const paginationConfig = computed(() =>
      isBool(props.pagination) || !props.pagination ? {} : (props.pagination as Record<string, any>)
    )
    const showPagination = computed(() => (isBool(props.pagination) ? props.pagination : true))

    const current = ref<number>(paginationConfig.value.current ?? 1)
    const pageSize = ref<number>(paginationConfig.value.pageSize ?? 10)

    const dataSource = computed(() => {
      const currentField = field.value as ArrayField
      const value = currentField?.value
      return Array.isArray(value) ? value.map((item, index) => Object.assign({}, item, { [indexKey]: index })) : []
    })

    const total = computed(() => dataSource.value.length)
    const totalPage = computed(() => Math.ceil(total.value / pageSize.value) || 0)
    const startIndex = computed(() => (current.value - 1) * pageSize.value)
    const pageDataSource = computed(() => {
      if (!showPagination.value) return dataSource.value
      return dataSource.value.slice(startIndex.value, startIndex.value + pageSize.value)
    })

    watch(totalPage, value => {
      if (value > 0 && value < current.value) {
        current.value = value
      }
    })

    watch(
      () => paginationConfig.value.pageSize,
      value => {
        pageSize.value = value || 10
      }
    )

    provide(ArrayTablePaginationContext, {
      get totalPage() {
        return totalPage.value
      },
      get pageSize() {
        return pageSize.value
      },
      get startIndex() {
        return startIndex.value
      },
      changePage(page: number) {
        current.value = page
      },
    })

    const renderCell = (schema: Schema, index: number) => {
      const currentField = field.value as ArrayField
      return (
        <ArrayBaseItem index={index} record={() => currentField?.value?.[index]}>
          <RecursionField schema={schema} name={index} onlyRenderProperties />
        </ArrayBaseItem>
      )
    }

    const columns = computed(() => {
      return sources.value.reduce<any[]>((buf, { name, columnProps, schema, display }, key) => {
        if (display && display !== 'visible') return buf
        if (!isColumnComponent(schema)) return buf
        const {
          title,
          label,
          dataIndex: _dataIndex,
          prop: _prop,
          minWidth: _minWidth,
          key: _key,
          ...rest
        } = columnProps
        return buf.concat({
          key: String(columnProps.key ?? name ?? key),
          title: title ?? label ?? name,
          dataIndex: name,
          ...rest,
          render: (_value: any, record: any) => {
            const index = record?.[indexKey]
            return index > -1 ? renderCell(schema, index) : null
          },
        })
      }, [])
    })

    onMounted(() => {
      const tbody = tableRef.value?.$el?.querySelector('tbody') as HTMLElement | null
      if (!tbody) return
      sortable = SortableJS.create(tbody, {
        animation: 150,
        handle: `.${basePrefixCls}-array-base-sort-handle`,
        ghostClass: `${basePrefixCls}-sort-ghost`,
        onEnd: event => {
          const start = startIndex.value
          const oldIndex = (event.oldIndex ?? 0) + start
          const newIndex = (event.newIndex ?? 0) + start
          if (oldIndex === newIndex) return
          ;(field.value as ArrayField | undefined)?.move(oldIndex, newIndex)
        },
      })
    })

    onBeforeUnmount(() => sortable?.destroy())

    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      return (
        <div class={cls(prefixCls, hashId.value, attrs.class as string)} style={attrs.style as any}>
          <ArrayBase>
            <Table
              {...attrs}
              ref={tableRef}
              rowKey={indexKey}
              dataSource={pageDataSource.value}
              columns={slots.default?.() ? undefined : columns.value}
              size={(attrs.size as any) ?? 'small'}
              pagination={false}
              class={cls(`${prefixCls}-table`)}
            >
              {slots.default?.()}
            </Table>
            {showPagination.value && totalPage.value > 0 ? (
              <div class={`${prefixCls}-pagination`}>
                <Pagination
                  current={current.value}
                  pageSize={pageSize.value}
                  total={total.value}
                  showSizeChanger
                  pageSizeOptions={[10, 20, 50, 100]}
                  onChange={(page: number, size: number) => {
                    if (size !== pageSize.value) {
                      pageSize.value = size
                      current.value = 1
                      return
                    }
                    current.value = page
                  }}
                />
              </div>
            ) : null}
            {sources.value.map((column, key) => {
              // 专门用来承接对 Column 的状态管理
              if (!isColumnComponent(column.schema)) return null
              return <RecursionField name={column.name} schema={column.schema} onlyRenderSelf key={key} />
            })}
            {addition.value}
          </ArrayBase>
        </div>
      )
    }
  },
})

export const ArrayTableAddition = defineComponent<IAdditionProps>(
  (_, { attrs, slots }) => {
    const array = useArray()
    const pagination = inject(ArrayTablePaginationContext, {})
    return () => (
      <Addition
        {...(attrs as IAdditionProps)}
        onClick={(e: MouseEvent) => {
          // 如果添加数据后将超过当前页，则自动切换到下一页
          const total = array?.field?.value?.length || 0
          const totalPage = pagination.totalPage ?? 0
          const pageSize = pagination.pageSize ?? 10
          if (total === totalPage * pageSize + 1 && isFn(pagination.changePage)) {
            pagination.changePage(totalPage + 1)
          }
          ;(attrs.onClick as any)?.(e)
        }}
      >
        {slots.default?.()}
      </Addition>
    )
  },
  { name: 'ArrayTableAddition', inheritAttrs: false }
)
