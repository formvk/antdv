import { connect, mapReadPretty } from '@formvk/vue'
import { InputNumber as AntInputNumber } from 'antdv-next'
import type { InputNumberProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextInputNumber } from '../preview-text'

export type InputNumberRef = InstanceType<typeof AntInputNumber>

const InputNumberWrapper = defineComponent<InputNumberProps>({
  name: 'InputNumber',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => <AntInputNumber {...attrs} value={value.value} onUpdate:value={setValue} />
  },
})

export const InputNumber = connect(InputNumberWrapper, mapReadPretty(TextInputNumber))
