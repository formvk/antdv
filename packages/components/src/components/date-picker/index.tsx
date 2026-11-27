import { connect, mapReadPretty } from '@formvk/vue'
import { DatePicker as AntDatePicker, DateRangePicker as AntDateRangePicker } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

import { dayjsable, useFieldModel } from '../../shared'
import { TextDatePicker, TextDateRangePicker } from '../preview-text'

type DatePickerWrapperProps = {
  modelValue?: any
  /** 选择器类型，默认 date */
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year'
  /** 展示格式，默认按 picker 推导 */
  format?: string
  /** 是否启用时间选择 */
  showTime?: boolean | Record<string, any>
}

const getDefaultFormat = (picker: string, showTime: boolean) => {
  if (picker === 'month') return 'YYYY-MM'
  if (picker === 'year') return 'YYYY'
  if (picker === 'week') return 'YYYY-wo'
  if (picker === 'quarter') return 'YYYY-[Q]Q'
  if (showTime) return 'YYYY-MM-DD HH:mm:ss'
  return 'YYYY-MM-DD'
}

const createDatePicker = (range: boolean, name: string) =>
  defineComponent<DatePickerWrapperProps>({
    name,
    inheritAttrs: false,
    props: {
      modelValue: { type: null as unknown as PropType<any>, default: undefined },
      picker: String as PropType<DatePickerWrapperProps['picker']>,
      format: String,
      showTime: { type: [Boolean, Object] as PropType<DatePickerWrapperProps['showTime']>, default: undefined },
    },
    emits: ['update:modelValue', 'update:value'],
    setup(props, { attrs, slots, emit }) {
      const { value, setValue } = useFieldModel(props, attrs, emit)
      // 表单值可能是字符串（如初始值经过序列化），antdv-next 只接受 dayjs 对象
      const pickerValue = computed(() => dayjsable(value.value))
      return () => {
        const { valueFormat: _valueFormat, ...rest } = attrs
        const picker = props.picker ?? 'date'
        const format = props.format ?? getDefaultFormat(picker, !!props.showTime)
        const Component: any = range ? AntDateRangePicker : AntDatePicker
        return (
          <Component
            {...rest}
            picker={range && picker === 'date' ? undefined : picker}
            format={format}
            showTime={props.showTime}
            value={pickerValue.value}
            onUpdate:value={setValue}
          >
            {slots}
          </Component>
        )
      }
    },
  })

export const DatePicker = connect(createDatePicker(false, 'DatePicker'), mapReadPretty(TextDatePicker))

export const DateRangePicker = connect(createDatePicker(true, 'DateRangePicker'), mapReadPretty(TextDateRangePicker))
