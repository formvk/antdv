import { isVoidField } from '@formvk/core'
import { connect, mapProps } from '@formvk/vue'
import { Transfer as AntTransfer } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'

const renderTitle = (item: any) => item.title ?? null

const TransferWrapper = defineComponent({
  name: 'Transfer',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel<any[]>(props, attrs, emit)
    return () => {
      const { dataSource: rawDataSource, ...rest } = attrs
      const dataSource = (rawDataSource ?? []) as any[]
      const normalized = dataSource.map(item =>
        Object.assign({}, item, {
          key: item.key ?? item.value,
          title: item.title ?? item.label,
        })
      )
      return (
        <AntTransfer
          {...rest}
          render={(rest.render as any) || renderTitle}
          dataSource={normalized}
          targetKeys={Array.isArray(value.value) ? value.value : []}
          onUpdate:targetKeys={setValue}
        />
      )
    }
  },
})

export const Transfer = connect(
  TransferWrapper,
  mapProps((props, field) => {
    if (isVoidField(field) || !field) return props
    // schema 通过 enum 声明数据源时，把 field.dataSource 同步为 dataSource；
    // 直接写在 componentProps 里的 dataSource 保持不变
    if (!field.dataSource?.length) return props
    return {
      ...props,
      dataSource: field.dataSource.map((item: any) =>
        Object.assign({}, item, {
          title: item.title || item.label,
          key: item.key || item.value,
        })
      ),
    }
  })
)
