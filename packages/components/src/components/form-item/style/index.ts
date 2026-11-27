import { Keyframes } from '@antdv-next/cssinjs'
import type { CSSObject } from '@antdv-next/cssinjs'
import type { GlobalToken } from 'antdv-next'

import { genStyleHook } from '../../../shared'
import type { GenerateStyle, TokenWithCommonCls } from '../../../shared'

const showHelpIn = new Keyframes('formvkShowHelpIn', {
  from: {
    opacity: 0,
    transform: 'translateY(-5px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

/** 1–24 栅格：labelCol / wrapperCol，保留 4 位小数 */
const genGridStyle = (token: TokenWithCommonCls<GlobalToken>): CSSObject => {
  const { componentCls } = token
  const grid = Array.from({ length: 24 }, (_, index) => {
    const span = index + 1
    return {
      [`${componentCls}-item-col-${span}`]: {
        flex: `0 0 ${Number(((span / 24) * 100).toFixed(4))}%`,
        maxWidth: `${Number(((span / 24) * 100).toFixed(4))}%`,
      },
    }
  })
  return grid.reduce((buf, item) => Object.assign(buf, item), {} as CSSObject)
}

const genFormItemStyle: GenerateStyle = token => {
  const {
    componentCls,
    antCls,
    colorTextHeading,
    colorTextDescription,
    colorError,
    colorWarning,
    colorSuccess,
    colorPrimary,
    colorPrimaryBorderHover,
    colorBorder,
    colorSplit,
    controlOutline,
    controlOutlineWidth,
    controlHeight,
    controlHeightSM,
    controlHeightLG,
    fontSize,
    fontSizeSM,
    fontSizeLG,
    lineHeight,
    marginLG,
    paddingXS,
    borderRadius,
  } = token

  const labelCls = `${componentCls}-label`
  const controlCls = `${componentCls}-control`
  const controlContentCls = `${controlCls}-content`
  const controlComponentCls = `${controlContentCls}-component`
  const helpCls = `${componentCls}-help`
  const extraCls = `${componentCls}-extra`
  const formTextCls = `${componentCls.replace(/-item$/, '')}-form-text`

  const activeStyle = {
    borderColor: colorPrimary,
    boxShadow: `0 0 0 ${controlOutlineWidth}px ${controlOutline}`,
  }

  return {
    [componentCls]: {
      ...genGridStyle(token),
      position: 'relative',
      display: 'flex',
      marginBottom: marginLG,
      fontSize,

      '&-layout-vertical': {
        display: 'block',

        [`> ${labelCls}`]: {
          minHeight: controlHeight,
          padding: `0 0 ${paddingXS}px`,
          lineHeight,
        },

        [`> ${labelCls} ${labelCls}-content`]: {
          whiteSpace: 'initial',
          textAlign: 'start',
        },
      },

      [labelCls]: {
        position: 'relative',
        display: 'flex',
        flex: '0 0 auto',
        alignItems: 'center',
        minHeight: controlHeight,
        lineHeight: `${controlHeight}px`,
        color: colorTextHeading,

        label: {
          cursor: 'text',
        },

        [`&${labelCls}-tooltip`]: {
          cursor: 'help',
          '*': {
            cursor: 'help',
          },
          label: {
            borderBottom: '1px dashed currentColor',
          },
        },

        [`${labelCls}-content`]: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',

          label: {
            whiteSpace: 'nowrap',
          },
        },

        [`${labelCls}-tooltip-icon`]: {
          display: 'inline-flex',
          alignItems: 'center',
          maxHeight: controlHeight,
          marginInlineStart: 4,
          color: colorTextDescription,
          cursor: 'help',

          span: {
            display: 'inline-block',
          },
        },

        [`${labelCls}-asterisk`]: {
          display: 'inline-block',
          marginInlineEnd: 4,
          color: colorError,
          fontFamily: 'SimSun, sans-serif',
        },

        [`${labelCls}-colon`]: {
          marginInlineStart: 2,
          marginInlineEnd: 8,
        },
      },

      [`&${componentCls}-label-wrap > ${labelCls} label`]: {
        whiteSpace: 'pre-line',
        wordBreak: 'break-all',
      },

      [controlCls]: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minWidth: 0,
        maxWidth: '100%',
      },

      [`&${componentCls}-control-wrap > ${controlCls}`]: {
        whiteSpace: 'pre-line',
        wordBreak: 'break-all',
      },

      [controlContentCls]: {
        display: 'flex',
        alignItems: 'center',
      },

      [controlComponentCls]: {
        position: 'relative',
        width: '100%',
        minHeight: controlHeight,
        lineHeight: `${controlHeight}px`,

        [`> ${antCls}-input, > ${antCls}-input-affix-wrapper, > ${antCls}-select,
        > ${antCls}-picker, > ${antCls}-input-number, > ${antCls}-cascader,
        > ${antCls}-tree-select, > ${antCls}-upload, > ${antCls}-switch,
        > ${antCls}-slider, > ${antCls}-select-view`]: {
          width: '100%',
        },
      },

      [`&${componentCls}-fullness > ${controlCls} > ${controlContentCls} > ${controlComponentCls} > *:first-child`]: {
        width: '100%',
      },

      [`${controlComponentCls}-has-feedback-icon`]: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        paddingInlineEnd: 8,
        border: `1px solid ${colorBorder}`,
        borderRadius,
        outline: 'none',
        transition: 'all 0.3s',
        touchAction: 'manipulation',

        [`${antCls}-input, ${antCls}-input-affix-wrapper, ${antCls}-select, ${antCls}-picker`]: {
          border: 'none !important',
          boxShadow: 'none !important',
        },
      },

      [`${componentCls}-addon-before, ${componentCls}-addon-after`]: {
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        minHeight: controlHeight,
      },

      [`${componentCls}-addon-before`]: {
        marginInlineEnd: 8,
      },

      [`${componentCls}-addon-after`]: {
        marginInlineStart: 8,
      },

      [`${componentCls}-indent`]: {
        flex: '0 0 auto',
        width: 16,
      },

      [`${helpCls}, ${extraCls}`]: {
        clear: 'both',
        minHeight: controlHeightSM,
        paddingTop: 0,
        color: colorTextDescription,
        lineHeight: `${controlHeightSM}px`,
        transition: 'color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
      },

      [`${helpCls}`]: {
        '&-appear, &-enter': {
          animationDuration: '0.3s',
          animationFillMode: 'both',
          animationTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        },

        '&-appear-active, &-enter-active': {
          animationName: showHelpIn,
        },
      },

      [`${componentCls}-error-help`]: {
        color: `${colorError} !important`,
      },

      [`${componentCls}-warning-help`]: {
        color: `${colorWarning} !important`,
      },

      [`${componentCls}-success-help`]: {
        color: `${colorSuccess} !important`,
      },

      [`${componentCls}-feedback-icon`]: {
        display: 'inline-flex',
        flex: '0 0 auto',
        alignItems: 'center',
      },

      '&-feedback-layout-terse': {
        marginBottom: 8,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },

      '&-feedback-layout-loose': {
        marginBottom: marginLG,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 2,
        },
      },

      '&-feedback-layout-none': {
        marginBottom: 0,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },

      '&-feedback-layout-popover': {
        marginBottom: 8,
      },

      [`&${componentCls}-success > ${controlCls} ${antCls}-input,
      &${componentCls}-success > ${controlCls} ${antCls}-input-affix-wrapper,
      &${componentCls}-success > ${controlCls} ${antCls}-select ${antCls}-select-selector,
      &${componentCls}-success > ${controlCls} ${antCls}-picker`]: {
        borderColor: `${colorSuccess} !important`,
      },

      [`&${componentCls}-warning > ${controlCls} ${antCls}-input,
      &${componentCls}-warning > ${controlCls} ${antCls}-input-affix-wrapper,
      &${componentCls}-warning > ${controlCls} ${antCls}-select ${antCls}-select-selector,
      &${componentCls}-warning > ${controlCls} ${antCls}-picker`]: {
        borderColor: `${colorWarning} !important`,
      },

      [`&${componentCls}-error > ${controlCls} ${antCls}-input,
      &${componentCls}-error > ${controlCls} ${antCls}-input-affix-wrapper,
      &${componentCls}-error > ${controlCls} ${antCls}-select ${antCls}-select-selector,
      &${componentCls}-error > ${controlCls} ${antCls}-picker`]: {
        borderColor: `${colorError} !important`,
      },

      [`&${componentCls}-control-align-left > ${controlCls} > ${controlContentCls}`]: {
        justifyContent: 'flex-start',
      },

      [`&${componentCls}-control-align-right > ${controlCls} > ${controlContentCls}`]: {
        justifyContent: 'flex-end',
      },

      [`&${componentCls}-label-align-left > ${labelCls}`]: {
        justifyContent: 'flex-start',
      },

      [`&${componentCls}-label-align-right > ${labelCls}`]: {
        justifyContent: 'flex-end',
      },

      [`&${componentCls}-bordered-none ${antCls}-input,
      &${componentCls}-bordered-none ${antCls}-input-affix-wrapper,
      &${componentCls}-bordered-none ${antCls}-select ${antCls}-select-selector,
      &${componentCls}-bordered-none ${antCls}-picker`]: {
        borderColor: 'transparent !important',
        boxShadow: 'none !important',
      },

      '&-inset': {
        paddingInlineStart: 12,
        border: `1px solid ${colorSplit}`,
        borderRadius,
        transition: '0.3s all',

        [`${antCls}-input, ${antCls}-input-affix-wrapper,
        ${antCls}-select ${antCls}-select-selector, ${antCls}-picker`]: {
          borderColor: 'transparent !important',
          boxShadow: 'none !important',
        },

        '&:hover': {
          borderColor: colorPrimaryBorderHover,
        },
      },

      '&-inset-active': {
        ...activeStyle,
      },

      '&-active': {
        [`${controlComponentCls}-has-feedback-icon`]: {
          ...activeStyle,
        },
      },

      [`&:hover ${controlComponentCls}-has-feedback-icon`]: {
        borderColor: colorPrimaryBorderHover,
      },

      '&-size-small': {
        fontSize: fontSizeSM,
        lineHeight: `${controlHeightSM}px`,

        [`> ${labelCls}`]: {
          minHeight: controlHeightSM,
          lineHeight: `${controlHeightSM}px`,
        },

        [`> ${controlCls} > ${controlContentCls},
        > ${controlCls} > ${controlContentCls} > ${controlComponentCls}`]: {
          minHeight: controlHeightSM,
        },
      },

      '&-size-large': {
        fontSize: fontSizeLG,
        lineHeight: `${controlHeightLG}px`,

        [`> ${labelCls}`]: {
          minHeight: controlHeightLG,
          lineHeight: `${controlHeightLG}px`,
        },

        [`> ${controlCls} > ${controlContentCls},
        > ${controlCls} > ${controlContentCls} > ${controlComponentCls}`]: {
          minHeight: controlHeightLG,
        },
      },

      [`${antCls}-input-number`]: {
        width: '100%',
        verticalAlign: 'top',

        [`+ ${formTextCls}`]: {
          marginInlineStart: 8,
        },
      },

      [`${antCls}-radio-group, ${antCls}-checkbox-group`]: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        minHeight: controlHeight,
      },

      [`${antCls}-radio-wrapper, ${antCls}-checkbox-wrapper`]: {
        margin: 0,
        fontWeight: 'normal',
        verticalAlign: 'middle',
        cursor: 'pointer',
      },

      [`${antCls}-switch`]: {
        minHeight: 22,
      },

      [`${antCls}-input[type='radio'], ${antCls}-input[type='checkbox']`]: {
        width: fontSize,
        height: fontSize,
      },
    },
  }
}

export const useStyle = genStyleHook('FormItem', token => genFormItemStyle(token))
