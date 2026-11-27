import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { Radio as AntRadio, RadioGroup as AntRadioGroup } from 'antdv-next'
import type { RadioGroupProps, RadioProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextSelect } from '../preview-text'

const modelProp = { type: null as unknown as PropType<any>, default: undefined }

const RadioWrapper = defineComponent<RadioProps>({
  name: 'Radio',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit, 'checked')
    return () => (
      <AntRadio {...attrs} checked={value.value} onUpdate:checked={setValue}>
        {slots.default?.()}
      </AntRadio>
    )
  },
})

const RadioGroupWrapper = defineComponent<RadioGroupProps>({
  name: 'RadioGroup',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => (
      <AntRadioGroup {...attrs} value={value.value} onUpdate:value={setValue}>
        {slots.default?.()}
      </AntRadioGroup>
    )
  },
})

export const InternalRadio: typeof AntRadio = connect(RadioWrapper) as unknown as typeof AntRadio

export const RadioGroup: typeof AntRadioGroup = connect(
  RadioGroupWrapper,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect)
) as unknown as typeof AntRadioGroup

export const Radio: typeof AntRadio = InternalRadio
