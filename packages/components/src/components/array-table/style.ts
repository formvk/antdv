import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('ArrayTable', token => {
  const { componentCls } = token

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,

      [`${componentCls}-pagination`]: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
    },
  }
})
