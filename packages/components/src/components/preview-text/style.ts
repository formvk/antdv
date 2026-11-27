import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('PreviewText', token => {
  const { componentCls, colorText, colorTextPlaceholder, controlHeight } = token

  return {
    [componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: controlHeight,
      color: colorText,
      wordBreak: 'break-all',
    },

    [`${componentCls}-placeholder`]: {
      color: colorTextPlaceholder,
    },
  }
})
