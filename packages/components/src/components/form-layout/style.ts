import { genStyleHook } from '../../shared'

const basePrefixOf = (prefixCls: string) => `.${prefixCls.replace(/-layout$/, '')}`

export const useStyle = genStyleHook('FormLayout', token => {
  const { componentCls } = token
  const formCls = `${basePrefixOf(token.prefixCls)}-form`
  const itemCls = `${basePrefixOf(token.prefixCls)}-item`

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,

      [`&${formCls}-inline`]: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',

        [`> ${itemCls}`]: {
          flex: '0 0 auto',
        },
      },

      [`&${formCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  }
})
