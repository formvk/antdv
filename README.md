# @formvk/antdv

基于 [Formvk](https://formvk.github.io/core/) 内核的 Ant Design Vue Next 表单桥接层，提供 Schema 驱动的表单、布局、数组与 CRUD 容器组件。

- 文档站点：<https://formvk.github.io/antdv/>
- 内核文档：<https://formvk.github.io/core/>

## 特性

- **Schema 驱动**：用一份 Schema 描述字段、布局与联动，字段状态、校验与生命周期由 Formvk 内核统一管理。
- **完整的组件桥接**：覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件，API 形态与 formily-antd 对齐。
- **antdv-next 样式体系**：直接复用 antdv-next 的控件与主题，暗色模式、ConfigProvider 全局配置天然一致。
- **TypeScript**：完整类型声明，支持 `createSchema + fragment` 的类型推导，并提供全局组件与 Volar 类型支持。
- **容器能力**：内置 `SchemaForm`、`PopupForm`、`CrudTable`、`SearchForm` 等容器，可通过插件全量注册或按需自动导入。

## 仓库结构

| 路径                  | 说明                          |
| --------------------- | ----------------------------- |
| `packages/components` | 发布的 `@formvk/antdv` 组件库 |
| `docs`                | VitePress 文档站点与示例      |

## 快速开始

```bash
pnpm add @formvk/antdv @formvk/core @formvk/vue @formvk/schema antdv-next vue
```

```vue
<script setup lang="ts">
import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antdv'
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/vue'

import 'antdv-next/dist/reset.css'

const form = createForm()

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
})
</script>

<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
      <Submit :on-submit="values => console.log(values)">提交</Submit>
    </Form>
  </OptionsProvider>
</template>
```

更多用法见[快速开始](https://formvk.github.io/antdv/guide/quick-start)与[组件总览](https://formvk.github.io/antdv/components/)。

## 开发

环境要求：Node.js `>=22.18.0`、pnpm `12`。

```bash
pnpm install       # 安装依赖
pnpm dev           # 组件库构建（watch）
pnpm build         # 构建组件库
pnpm test          # 运行单元测试
pnpm typecheck     # 类型检查
pnpm lint          # oxlint 代码检查
pnpm format:check  # oxfmt 格式检查
pnpm docs:dev      # 本地启动文档
pnpm docs:build    # 构建文档
```

提交前会通过 husky + lint-staged 自动执行 lint 与格式化。

## License

[MIT](https://opensource.org/licenses/MIT)
