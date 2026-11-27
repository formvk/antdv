import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('CrudTable', token => {
  const { componentCls } = token

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
  }
})
