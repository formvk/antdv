import { Space as AntSpace } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFormLayout } from '../../hooks'

export type ISpaceProps = {
  size?: number | string | [number | string, number | string]
  direction?: 'horizontal' | 'vertical'
  wrap?: boolean
  align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline'
}

export const Space = defineComponent<ISpaceProps>({
  name: 'Space',
  inheritAttrs: false,
  props: {
    size: {
      type: [Number, String, Array] as PropType<ISpaceProps['size']>,
      default: undefined,
    },
    direction: String as PropType<ISpaceProps['direction']>,
    wrap: { type: Boolean, default: undefined },
    align: String as PropType<ISpaceProps['align']>,
  },
  setup(props, { slots, attrs }) {
    const layout = useFormLayout()
    return () => (
      <AntSpace
        {...attrs}
        size={(props.size ?? layout.value?.spaceGap) as any}
        direction={props.direction}
        align={props.align}
        wrap={props.wrap}
      >
        {slots.default?.()}
      </AntSpace>
    )
  },
})
