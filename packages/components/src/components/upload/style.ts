import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('UploadDragger', token => {
  const { componentCls, antCls } = token

  return {
    [componentCls]: {
      width: '100%',

      [`${antCls}-upload, ${antCls}-upload${antCls}-upload-drag`]: {
        width: '100%',
      },
    },
  }
})
