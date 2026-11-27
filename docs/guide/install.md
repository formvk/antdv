# 安装

本页帮助你从零搭建 `@formvk/antdv` 的运行环境，并完成第一个表单的前置准备。

## 环境要求

| 依赖 | 版本要求 | 仓库实际使用 |
| --- | --- | --- |
| Vue | `^3.5.0`（peerDependencies） | `3.5.46` |
| Ant Design Vue Next | `^1.8.0`（peerDependencies） | `1.8.3` |
| `@formvk/*` 内核包 | `~1.2.0-beta.4` | `~1.2.0-beta.4` |
| `@formvk/antdv` | — | `1.0.0-beta.1` |
| TypeScript | 可选，建议 `>=5.0` | `~6.0.3` |
| Node.js（工程环境） | `>=22.18.0` | `>=22.18.0` |

## 安装依赖

```bash
# pnpm
pnpm add @formvk/antdv @formvk/core @formvk/vue @formvk/schema antdv-next vue

# npm
npm install @formvk/antdv @formvk/core @formvk/vue @formvk/schema antdv-next vue

# yarn
yarn add @formvk/antdv @formvk/core @formvk/vue @formvk/schema antdv-next vue
```

`@formvk/antdv` 只提供组件桥接层：表单实例、`SchemaField` 工厂等内核能力需要从 `@formvk/vue` 导入，因此建议显式安装 `@formvk/core`、`@formvk/vue` 与 `@formvk/schema`。内核的表单模型、生命周期与 Hooks 用法详见 [Formvk 内核文档](https://formvk.github.io/core/)。

## 样式

`@formvk/antdv` 使用 antdv-next 的 **CSS-in-JS** 方案：桥接层的布局类在组件渲染时由 cssinjs 自动注入，控件视觉完全复用 antdv-next，因此**不需要额外引入任何 CSS 文件**。

只需要引入 antdv-next 的基础重置样式：

```ts
import 'antdv-next/dist/reset.css'
```

- 桥接层样式会读取 `ConfigProvider` 的 `theme`、`prefixCls`、`cssVar`、`direction` 等配置，暗色模式与主题定制开箱即用。
- `StyleProvider` 的 `hashPriority`、`csp.nonce`、`layer` 等能力同样作用于桥接层样式。
- 默认类名前缀为 `ant-formvk-*`；通过 `ConfigProvider` 修改 `prefixCls` 后，运行时类名与注入的样式会同步变为 `${prefixCls}-formvk-*`，无需额外提供样式文件。

```vue
<!-- App.vue -->
<template>
  <ConfigProvider prefix-cls="ns">
    <RouterView />
  </ConfigProvider>
</template>
```

antdv-next 支持完整引入或按需引入，桥接组件不要求把 antdv-next 注册为全局插件。

## 按需导入

容器组件可以通过 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 自动按需引入：

```bash
pnpm add -D unplugin-vue-components
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { FormvkAntdvResolver } from '@formvk/antdv/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [FormvkAntdvResolver()],
    }),
  ],
})
```

解析器只覆盖 `containers` 目录下的容器组件（`SchemaForm`、`PopupForm`、`ModalForm`、`DrawerForm`、`CrudTable`、`DataTable`、`SearchForm`、`AddPopup`、`EditPopup`）。字段、布局与数组组件由 schema 内部解析，不需要注册；`renders` 是渲染函数，也不参与注册。样式由 cssinjs 自动注入，无需额外配置。

## 全量注册

不使用按需插件时，可以通过插件一次性注册全部容器组件：

```ts
import { createApp } from 'vue'
import FormvkAntdv from '@formvk/antdv'
import 'antdv-next/dist/reset.css'

createApp(App).use(FormvkAntdv).mount('#app')
```

全量注册只包含 `containers` 目录下的容器组件；字段、布局与数组组件由 schema 内部解析，不参与注册。

## Volar 支持

使用 Volar 时，全局注册的组件默认无法获得模板类型提示。可以在 `tsconfig.json` 中引入本包提供的全局组件类型：

```json
{
  "compilerOptions": {
    "types": ["@formvk/antdv/global"]
  }
}
```

引入后，`SchemaForm`、`CrudTable`、`DataTable` 等全局容器组件在模板中会获得完整的 props 与事件类型提示。该方式仅影响类型，不会产生运行时行为。

如果使用 `unplugin-vue-components` 按需导入，插件会自动生成 `components.d.ts`，无需再引入此类型。

## 下一步

继续阅读[快速开始](/guide/quick-start)，用十分钟完成第一个 Schema 驱动表单。

想了解本包与 formily-antd 的完整差异，见[与 formily-antd 的差异](/guide/explanation/formily-diff)。
