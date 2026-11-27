import { connect, mapReadPretty } from '@formvk/vue'
import { TimePicker as AntTimePicker, TimeRangePicker as AntTimeRangePicker } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

import { dayjsable, useFieldModel } from '../../shared'
import { TextTimePicker, TextTimeRangePicker } from '../preview-text'

type TimePickerWrapperProps = {
  modelValue?: any
  /** 展示格式，默认 HH:mm:ss */
  format?: string
}

const createTimePicker = (range: boolean, name: string) =>
  defineComponent<TimePickerWrapperProps>({
    name,
    inheritAttrs: false,
    props: {
      modelValue: { type: null as unknown as PropType<any>, default: undefined },
      format: String,
    },
    emits: ['update:modelValue', 'update:value'],
    setup(props, { attrs, slots, emit }) {
      const { value, setValue } = useFieldModel(props, attrs, emit)
      // 同 DatePicker：兼容字符串形式的初始值
      const pickerValue = computed(() => dayjsable(value.value))
      return () => {
        const { valueFormat: _valueFormat, ...rest } = attrs
        const Component: any = range ? AntTimeRangePicker : AntTimePicker
        return (
          <Component {...rest} format={props.format ?? 'HH:mm:ss'} value={pickerValue.value} onUpdate:value={setValue}>
            {slots}
          </Component>
        )
      }
    },
  })

export const TimePicker = connect(createTimePicker(false, 'TimePicker'), mapReadPretty(TextTimePicker))

export const TimeRangePicker = connect(createTimePicker(true, 'TimeRangePicker'), mapReadPretty(TextTimeRangePicker))
