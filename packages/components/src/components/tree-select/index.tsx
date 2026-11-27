import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { TreeSelect as AntTreeSelect } from 'antdv-next'
import type { TreeSelectProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextTreeSelect } from '../preview-text'

const TreeSelectWrapper = defineComponent<TreeSelectProps>({
  name: 'TreeSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: undefined },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => <AntTreeSelect {...attrs} value={value.value} onUpdate:value={setValue} />
  },
})

export const TreeSelect: typeof AntTreeSelect = connect(
  TreeSelectWrapper,
  mapProps({
    dataSource: 'treeData',
  }),
  mapReadPretty(TextTreeSelect)
) as unknown as typeof AntTreeSelect
