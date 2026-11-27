import type { ArrayField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { Badge, Tabs } from 'antdv-next'
import type { TabsProps } from 'antdv-next'
import { computed, defineComponent, ref } from 'vue'

import { cls, usePrefixCls } from '../../shared'
import { useStyle } from './style'

const FeedbackBadge = defineComponent({
  name: 'ArrayTabsFeedbackBadge',
  props: { index: { type: Number, required: true } },
  setup(props) {
    const field = useField<ArrayField>()
    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      const tab = `${currentField.title || 'Untitled'} ${props.index + 1}`
      const errors = (currentField.errors ?? []).filter(error =>
        String(error.address ?? '').includes(`${currentField.address}.${props.index}`)
      )
      if (errors.length) {
        return (
          <Badge count={errors.length}>
            <span>{tab}</span>
          </Badge>
        )
      }
      return <span>{tab}</span>
    }
  },
})

export const ArrayTabs = defineComponent<TabsProps & { prefixCls?: string }>({
  name: 'ArrayTabs',
  inheritAttrs: false,
  props: {
    prefixCls: String,
  },
  setup(props, { attrs }) {
    const field = useField<ArrayField>()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('array-tabs', props)
    const hashId = useStyle(prefixCls)
    const activeKey = ref('tab-0')

    const getKey = (index: number) => {
      const currentField = field.value as ArrayField
      return String(currentField?.getRecordKey(index) ?? index)
    }

    const dataSource = computed(() => {
      const currentField = field.value as ArrayField
      if (!currentField) return []
      const value = Array.isArray(currentField.value) ? currentField.value : []
      return value.length ? value : [{}]
    })

    const tabKeys = computed(() => dataSource.value.map((_, index) => getKey(index)))
    const mergedActiveKey = computed(() =>
      tabKeys.value.includes(activeKey.value) ? activeKey.value : tabKeys.value[0]
    )

    const onEdit = (targetKey: any, action: 'add' | 'remove') => {
      const currentField = field.value as ArrayField
      if (!currentField) return
      const itemSchema = Array.isArray(schema.value?.items) ? schema.value?.items[0] : schema.value?.items
      const defaultValue = itemSchema?.type === 'object' ? {} : null
      if (action === 'add') {
        const id = dataSource.value.length
        if (currentField.value?.length) {
          currentField.push(defaultValue)
        } else {
          currentField.push(defaultValue, defaultValue)
        }
        activeKey.value = getKey(id)
      } else if (action === 'remove') {
        const index = dataSource.value.findIndex((_, i) => getKey(i) === String(targetKey))
        if (index < 0) return
        if (index - 1 > -1) {
          activeKey.value = getKey(index - 1)
        }
        currentField.remove(index)
      }
    }

    const items = computed(() =>
      dataSource.value.map((_, index) => {
        const itemSchema = Array.isArray(schema.value?.items)
          ? schema.value.items[index] || schema.value.items[0]
          : schema.value?.items
        return {
          key: getKey(index),
          label: <FeedbackBadge index={index} />,
          closable: index !== 0,
          forceRender: true,
          content: itemSchema ? <RecursionField schema={itemSchema} name={index} /> : null,
        }
      })
    )

    return () => {
      const currentField = field.value as ArrayField
      if (!currentField) return null
      return (
        <Tabs
          {...attrs}
          type={((attrs.type as string) ?? 'editable-card') as any}
          activeKey={mergedActiveKey.value}
          class={cls(prefixCls, hashId.value)}
          items={items.value as any}
          onUpdate:activeKey={(key: string) => {
            activeKey.value = key
          }}
          onEdit={onEdit}
        />
      )
    }
  },
})
