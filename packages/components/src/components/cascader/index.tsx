import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { Cascader as AntCascader } from 'antdv-next'
import type { CascaderProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextCascader } from '../preview-text'

const CascaderWrapper = defineComponent<CascaderProps>({
  name: 'Cascader',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => <AntCascader {...attrs} value={value.value} onUpdate:value={setValue} />
  },
})

export const Cascader: typeof AntCascader = connect(
  CascaderWrapper,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextCascader)
) as unknown as typeof AntCascader
