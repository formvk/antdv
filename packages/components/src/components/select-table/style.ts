import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('SelectTable', token => {
  const { componentCls } = token

  return {
    [componentCls]: {
      [`${componentCls}-search`]: {
        maxWidth: 320,
      },

      [`${componentCls}-selection`]: {
        verticalAlign: 'middle',
      },
    },
  }
})
