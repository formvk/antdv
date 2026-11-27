# Cascader

级联选择组件，基于 Ant Design Vue Next `Cascader` 封装。Schema 中的 `enum` 会通过 `dataSource` 自动映射为 `options`，字段值为所选路径的 `value` 数组；阅读态自动切换为 `TextCascader`。

<demo vue="../demos/cascader.vue" title="Cascader 示例" description="默认级联、任意一级可选、多选，含 readPretty 阅读态" />

## 何时使用

- 选项具有清晰的层级结构，如省市区、组织架构、商品分类。
- 需要从树形结构中选择一条或多条路径。
- 扁平的大量选项更适合 [Select](/components/select) 或 [TreeSelect](/components/tree-select)。

## 属性

继承 Ant Design Vue Next [`Cascader`](https://antdv-next.com/components/cascader) 的属性，未列出的属性与 `Cascader` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `Option[]` | 级联数据 |
| `dataSource` | `Option[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |
| `changeOnSelect` | `boolean` | 是否允许选择任意一级 |
| `multiple` | `boolean` | 是否开启多选 |
| `maxTagCount` | `number \| 'responsive'` | 多选时已选标签的折叠策略 |
| `allowClear` | `boolean` | 是否展示清除按钮 |
| `showSearch` | `boolean` | 是否可搜索 |
| `disabled` | `boolean` | 禁用选择 |

## 阅读态

`readPretty` 模式下自动切换为 `TextCascader`，单条路径的各级标签以 `/` 连接，多条路径以空格分隔；找不到对应选项或值为空时展示 `previewTextPlaceholder`。

## 注意事项

- 单选时字段值是路径数组（如 `['zhejiang', 'hangzhou']`），多选时是路径数组的数组。
- `changeOnSelect` 与 `multiple` 都是组件顶层属性，直接写在 `componentProps` 中。
