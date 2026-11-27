import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('Editable', token => {
  const { componentCls, colorTextDescription, colorPrimary } = token

  return {
    [componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      minWidth: 0,
      maxWidth: '100%',

      [`${componentCls}-content`]: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },

      [`${componentCls}-preview`]: {
        cursor: 'pointer',
      },

      [`${componentCls}-edit-btn, ${componentCls}-close-btn`]: {
        flex: '0 0 auto',
        color: colorTextDescription,
        cursor: 'pointer',

        '&:hover': {
          color: colorPrimary,
        },
      },
    },
  }
})
