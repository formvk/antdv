import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { Checkbox as AntCheckbox, CheckboxGroup as AntCheckboxGroup } from 'antdv-next'
import type { CheckboxGroupProps, CheckboxProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextSelect } from '../preview-text'

const modelProp = { type: null as unknown as PropType<any>, default: undefined }

const CheckboxWrapper = defineComponent<CheckboxProps>({
  name: 'Checkbox',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit, 'checked')
    return () => (
      <AntCheckbox {...attrs} checked={value.value} onUpdate:checked={setValue}>
        {slots.default?.()}
      </AntCheckbox>
    )
  },
})

const CheckboxGroupWrapper = defineComponent<CheckboxGroupProps>({
  name: 'CheckboxGroup',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => (
      <AntCheckboxGroup {...attrs} value={value.value} onUpdate:value={setValue}>
        {slots.default?.()}
      </AntCheckboxGroup>
    )
  },
})

export const Checkbox: typeof AntCheckbox = connect(CheckboxWrapper) as unknown as typeof AntCheckbox

export const CheckboxGroup: typeof AntCheckboxGroup = connect(
  CheckboxGroupWrapper,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect, {
    multiple: true,
  })
) as unknown as typeof AntCheckboxGroup
