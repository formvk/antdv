import type { CSSInterpolation, CSSObject } from '@antdv-next/cssinjs'
import { useStyleRegister } from '@antdv-next/cssinjs'
import { merge } from '@formvk/shared'
import type { GlobalToken } from 'antdv-next'
import { theme } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed } from 'vue'
import type { Ref } from 'vue'

export type OverrideComponent = keyof GlobalToken | (string & {})

export interface StyleInfo {
  hashId: string
  prefixCls: string
  rootPrefixCls: string
  iconPrefixCls: string
}

export type TokenWithCommonCls<T> = T & {
  /** 带 `.` 前缀的组件类名 */
  componentCls: string
  /** 不带 `.` 前缀的组件类名 */
  prefixCls: string
  /** 带 `.` 前缀的图标类名 */
  iconCls: string
  /** 带 `.` 前缀的 antd 根类名 */
  antCls: string
}

export type GenerateStyle<
  ComponentToken extends object = TokenWithCommonCls<GlobalToken>,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken, options?: any) => ReturnType

/** 与 antd 一致：为所有桥接层类补齐字体与盒模型，避免与业务样式冲突 */
export const genCommonStyle = (token: any, componentPrefixCls: string): CSSObject => {
  const { fontFamily, fontSize } = token

  const rootPrefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`

  return {
    [rootPrefixSelector]: {
      fontFamily,
      fontSize,
      boxSizing: 'border-box',

      '&::before, &::after': {
        boxSizing: 'border-box',
      },

      [rootPrefixSelector]: {
        boxSizing: 'border-box',

        '&::before, &::after': {
          boxSizing: 'border-box',
        },
      },
    },
  }
}

/**
 * 基于 antdv-next 的 cssinjs 注册组件样式，返回 hashId Ref。
 * 组件根节点需要拼接 `hashId.value`，样式选择器会被 cssinjs 限定在该 hash 下。
 */
export const genStyleHook = <ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: TokenWithCommonCls<GlobalToken>, info: StyleInfo) => CSSInterpolation
) => {
  return (prefixCls: string): Ref<string> => {
    const { theme: themeRef, token, hashId } = theme.useToken()
    const config = useConfig()

    useStyleRegister(
      computed(() => {
        const current = config.value
        return {
          theme: themeRef.value,
          token: token.value,
          hashId: hashId.value,
          nonce: current?.csp?.nonce,
          path: ['formvk-antdv', component, prefixCls, current?.iconPrefixCls ?? 'anticon'],
        }
      }),
      () => {
        const current = config.value
        const iconPrefixCls = current?.iconPrefixCls ?? 'anticon'
        const rootPrefixCls = current?.getPrefixCls?.() ?? 'ant'
        const componentCls = `.${prefixCls}`
        const mergedToken = merge(token.value, {
          // 合并 antdv-next Form 组件 token，保持标签相关 token 一致
          ...(token.value as any).Form,
          componentCls,
          prefixCls,
          iconCls: `.${iconPrefixCls}`,
          antCls: `.${rootPrefixCls}`,
        }) as TokenWithCommonCls<GlobalToken>

        return [
          genCommonStyle(token.value, prefixCls),
          styleFn(mergedToken, {
            hashId: hashId.value,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls,
          }),
        ]
      }
    )

    return hashId
  }
}
