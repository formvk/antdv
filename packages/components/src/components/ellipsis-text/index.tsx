import { Tooltip } from 'antdv-next'
import { defineComponent } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { useOverflow } from '../../hooks'

export interface EllipsisTextProps {
  tooltipProps?: Record<string, any>
  style?: CSSProperties
}

/** 单行省略文本，内容溢出时通过 Tooltip 展示完整内容 */
export const EllipsisText = defineComponent<EllipsisTextProps>({
  name: 'EllipsisText',
  inheritAttrs: false,
  props: {
    tooltipProps: Object as PropType<Record<string, any>>,
    style: Object as PropType<CSSProperties>,
  },
  setup(props, { slots }) {
    const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>()

    return () => (
      <Tooltip {...props.tooltipProps} title={(overflow.value ? slots.default?.() : undefined) as any}>
        <div
          ref={containerRef}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ...props.style,
          }}
        >
          <span ref={contentRef}>{slots.default?.()}</span>
        </div>
      </Tooltip>
    )
  },
})
