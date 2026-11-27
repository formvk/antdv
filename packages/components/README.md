# @formvk/antdv

基于 [Formvk](https://formvk.github.io/core/) 内核的 Ant Design Vue Next 表单桥接层，提供 Schema 驱动的表单、布局、数组与 CRUD 容器组件。

- 文档站点：<https://formvk.github.io/antdv/>
- 内核文档：<https://formvk.github.io/core/>

## 安装

环境要求：Vue `^3.5.0`、antdv-next `^1.8.0`。

```bash
pnpm add @formvk/antdv @formvk/core @formvk/vue @formvk/schema antdv-next vue
```

## 使用

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

## 导出

| 入口                     | 说明                                     |
| ------------------------ | ---------------------------------------- |
| `@formvk/antdv`          | 组件、容器、hooks 与安装插件             |
| `@formvk/antdv/resolver` | `unplugin-vue-components` 按需导入解析器 |
| `@formvk/antdv/global`   | Volar 全局组件类型                       |

## 样式

本包使用 antdv-next 的 CSS-in-JS 方案：桥接层的布局类在组件渲染时由 cssinjs 自动注入，主题、暗色模式与前缀均跟随 `ConfigProvider`，无需引入额外 CSS。只需引入 antdv-next 的基础重置样式：

```ts
import 'antdv-next/dist/reset.css'
```

## License

MIT
