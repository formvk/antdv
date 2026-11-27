import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('ArrayItems', token => {
  const { componentCls, colorSplit } = token

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,

      [`${componentCls}-list`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      },

      [`${componentCls}-item`]: {
        display: 'flex',
        gap: 8,
      },

      [`${componentCls}-item-inner`]: {
        flex: '1 1 auto',
        minWidth: 0,
      },

      [`${componentCls}-item-controls`]: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
      },
    },

    [`${componentCls}-card`]: {
      padding: 12,
      border: `1px solid ${colorSplit}`,
      borderRadius: 8,
    },

    [`${componentCls}-divide`]: {
      paddingBottom: 12,
      borderBottom: `1px solid ${colorSplit}`,
    },
  }
})
