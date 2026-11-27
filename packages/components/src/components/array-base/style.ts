import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('ArrayBase', token => {
  const { componentCls, colorTextDescription, colorPrimary } = token

  return {
    [`${componentCls}-sort-handle`]: {
      cursor: 'move',
      color: colorTextDescription,

      '&:hover': {
        color: colorPrimary,
      },
    },

    [`${componentCls}-index`]: {
      marginRight: 4,
      color: colorTextDescription,
    },

    [`${componentCls}-remove, ${componentCls}-copy, ${componentCls}-move-up, ${componentCls}-move-down`]: {
      padding: '0 4px',
    },
  }
})
