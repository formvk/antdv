# Vue 速查

Vue 3 下的桥接代码。字段契约、mapper 语义、装饰器与数组契约见 [SKILL.md](../SKILL.md)。

对应 AI 文档：[Custom Components](https://formvk.github.io/core/vue/custom-components.md)、[Hooks](https://formvk.github.io/core/vue/hooks.md)

## 受控控件

```vue
<script setup lang="ts">
import type { Field } from '@formvk/core'
import { useField } from '@formvk/vue'
import { Select } from 'antdv-next'

defineProps<{ options?: Array<{ label: string; value: string }> }>()

const fieldRef = useField<Field>()
</script>

<template>
  <Select
    :value="fieldRef?.value"
    :disabled="fieldRef?.disabled || fieldRef?.readOnly"
    :options="options"
    @update:value="fieldRef?.setValue($event)"
  />
</template>
```

## mapper 适配

antdv-next 控件统一使用 `value` + `onUpdate:value`（Checkbox / Switch 为 `checked`）：

```ts
import { isVoidField } from '@formvk/core'
import { connect, mapProps, mapReadPretty } from '@formvk/vue'
import { Input as AntInput } from 'antdv-next'

import { Text } from '../components/Text'

export const Input = connect(
  AntInput,
  mapProps({ value: 'value', disabled: 'disabled', readOnly: 'readonly' }, (_props, field) => ({
    'onUpdate:value': (value: string) => {
      if (!isVoidField(field)) field.setValue(value)
    },
  })),
  mapReadPretty(Text)
)
```

- Vue 的 `mapProps` 只处理 `attrs`（包装组件 `inheritAttrs: false`），包装层不要再把这些 prop 声明成自己的 props。
- 日期等需要值转换的控件，在函数 mapper 里转换字段值（antdv-next 使用 dayjs 对象），变更时再转回表单存储的格式。
- 只读展示组件从透传 props 里拿 `value`，必要时合并 `readPrettyProps`。

Select 的数据源来自 `field.dataSource`（schema 里的 `enum`），antdv-next 需要 `options`。用 mapper 完成重命名即可，不需要再包一层渲染选项：

```ts
export const Select = connect(
  AntSelect, // antdv-next 的 Select 直接接收 options
  mapProps({ dataSource: 'options', value: 'value', disabled: 'disabled' }, (_props, field) => ({
    'onUpdate:value': (value: string) => {
      if (!isVoidField(field)) field.setValue(value)
    },
  }))
)
```

消费方写 `f.Select({ enum: [...] })` 即可，`dataSource → options` 的差异被桥接层吸收。

## 装饰器

```vue
<script setup lang="ts">
import { useField } from '@formvk/vue'

defineProps<{ label?: string; description?: string; errors?: string[] }>()

const fieldRef = useField()
</script>

<template>
  <div class="form-item">
    <label>
      {{ label ?? fieldRef?.title }}
      <em v-if="fieldRef?.required">*</em>
    </label>
    <slot />
    <span>{{ description ?? fieldRef?.description }}</span>
    <span v-for="error in errors ?? fieldRef?.selfErrors" :key="error">{{ error }}</span>
  </div>
</template>
```

## 数组组件

```vue
<script setup lang="ts">
import type { ArrayField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'

const field = useField<ArrayField>()
const schema = useFieldSchema()
</script>

<template>
  <div v-for="(_, index) in field?.value" :key="index">
    <RecursionField :schema="schema.items" :name="index" />
    <button type="button" @click="field?.remove(index)">Remove</button>
  </div>
  <button type="button" @click="field?.push({})">Add</button>
</template>
```

## 测试

用 `@vue/test-utils` 挂载真实表单，断言 `form.values`：

```ts
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const wrapper = mount(App)
await wrapper.find('input').setValue('bob')
await nextTick()
expect(form.values.name).toBe('bob')
```

- 控件事件后必须 `await nextTick()` 再断言。
- 只读模式检查是否渲染 `Text`，而不是只检查 `disabled`。
- 数组用例覆盖 `push` / `remove` 后项是否重新渲染。
