import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { Select as AntSelect } from 'antdv-next'
import type { SelectProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextSelect } from '../preview-text'

const SelectWrapper = defineComponent<SelectProps>({
  name: 'Select',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => <AntSelect {...attrs} value={value.value} onUpdate:value={setValue} />
  },
})

export const Select: typeof AntSelect = connect(
  SelectWrapper,
  mapProps({
    dataSource: 'options',
    loading: true,
  }),
  mapReadPretty(TextSelect)
) as unknown as typeof AntSelect
