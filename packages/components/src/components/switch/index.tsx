import { connect } from '@formvk/vue'
import { Switch as AntSwitch } from 'antdv-next'
import type { SwitchProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'

const SwitchWrapper = defineComponent<SwitchProps>({
  name: 'Switch',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit, 'checked')
    return () => <AntSwitch {...attrs} checked={value.value} onUpdate:checked={setValue} />
  },
})

export const Switch: typeof AntSwitch = connect(SwitchWrapper) as unknown as typeof AntSwitch
