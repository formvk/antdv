import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('FormButtonGroup', token => {
  const { componentCls } = token

  return {
    [componentCls]: {
      display: 'flex',
      width: '100%',
    },

    [`${componentCls}-sticky`]: {
      width: '100%',
    },

    [`${componentCls}-sticky-inner`]: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
    },
  }
})
