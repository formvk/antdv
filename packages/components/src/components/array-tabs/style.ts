import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('ArrayTabs', token => {
  const { componentCls, antCls } = token

  return {
    [componentCls]: {
      width: '100%',

      [`${antCls}-tabs-content`]: {
        overflow: 'visible',
      },
    },
  }
})
