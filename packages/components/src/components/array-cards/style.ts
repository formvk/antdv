import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('ArrayCards', token => {
  const { componentCls } = token

  return {
    [`${componentCls}-item`]: {
      width: '100%',
    },
  }
})
