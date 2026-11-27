import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('FormGrid', token => {
  const { componentCls } = token

  return {
    [`${componentCls}-layout`]: {
      display: 'grid',
      width: '100%',
    },
  }
})
