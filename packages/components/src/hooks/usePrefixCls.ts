import { useBaseConfig } from 'antdv-next/config-provider/context'

/** 桥接层类名的固定后缀，完整前缀为 `${prefixCls}-formvk`（默认 `ant-formvk`） */
const PREFIX_SUFFIX = 'formvk'

/**
 * 计算组件类名，前缀跟随 antdv-next 的 ConfigProvider。
 * - 默认返回 `ant-formvk-item`
 * - `ConfigProvider` 设置 `prefixCls="ns"` 后返回 `ns-formvk-item`
 * - 显式 `prefixCls` 优先
 */
export const usePrefixCls = (tag?: string, props?: { prefixCls?: string }) => {
  const { prefixCls } = useBaseConfig(PREFIX_SUFFIX)
  if (props?.prefixCls) return props.prefixCls
  const prefix = prefixCls.value
  if (!tag) return prefix
  return tag.startsWith(`${prefix}-`) ? tag : `${prefix}-${tag}`
}
