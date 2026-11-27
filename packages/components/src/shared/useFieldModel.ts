import { computed } from 'vue'

export interface IFieldModelProps {
  modelValue?: any
  [key: string]: any
}

/**
 * antdv-next 控件以 `value` / `update:value` 双向绑定，
 * 而 `@formvk/vue` 向字段组件注入 `modelValue` / `update:modelValue`。
 *
 * 该 helper 负责在两种协议之间转换：
 * - 表单内优先读取内核注入的 `modelValue`；
 * - 脱离表单时回退到调用方传入的 `value` / `checked`；
 * - 值变更时同时派发两种更新事件，便于在表单外使用 `v-model:value`。
 */
export const useFieldModel = <T = any, P extends object = IFieldModelProps>(
  props: P,
  attrs: Record<string, any>,
  emit: (event: 'update:modelValue' | 'update:value', value: T) => void,
  fallbackKey = 'value'
) => {
  const value = computed<T>(() => {
    const modelValue = (props as IFieldModelProps).modelValue
    return modelValue !== undefined ? modelValue : attrs[fallbackKey]
  })
  const setValue = (next: T) => {
    emit('update:modelValue', next)
    emit('update:value', next)
  }
  return { value, setValue }
}
