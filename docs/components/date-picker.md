# DatePicker

日期选择组件，基于 Ant Design Vue Next `DatePicker` 封装。字段值为 **dayjs 对象**（与 antdv-next 原生行为一致），阅读态自动切换为 `TextDatePicker`。

<demo vue="../demos/date-picker.vue" title="picker / showTime / format / DateRangePicker" description="日期、月份、年份、日期时间与范围选择，含 readPretty 阅读态" />

## 何时使用

- 需要录入日期、月份、年份或日期时间。
- 需要选择一个时间区间时使用同包导出的 `DateRangePicker`。
- 需要在业务层直接使用 dayjs 做日期计算，而不是频繁与字符串互转。

## 属性

继承 Ant Design Vue Next [`DatePicker`](https://antdv-next.com/components/date-picker) 的属性，未列出的属性与 `DatePicker` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `Dayjs` | 字段值（dayjs 对象），由内核注入 |
| `picker` | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | 选择器粒度，默认 `date` |
| `showTime` | `boolean \| object` | 是否附加时间选择，为 `true` 时展示时间面板 |
| `format` | `string` | 展示格式，不传时按 `picker` / `showTime` 推导默认值 |
| `allowClear` | `boolean` | 是否展示清除按钮 |
| `disabled` | `boolean` | 禁用选择 |

### DateRangePicker

`DateRangePicker` 为独立具名导出，字段值为 `[Dayjs, Dayjs]`，属性与 Ant Design Vue Next 范围选择器一致。

默认格式推导规则：

| picker / showTime | 默认 format |
| --- | --- |
| `date` | `YYYY-MM-DD` |
| `month` | `YYYY-MM` |
| `year` | `YYYY` |
| `week` | `YYYY-wo` |
| `quarter` | `YYYY-[Q]Q` |
| `showTime` | `YYYY-MM-DD HH:mm:ss` |

## 阅读态

`readPretty` 模式下，`DatePicker` 与 `DateRangePicker` 分别切换为 `TextDatePicker` / `TextDateRangePicker`，按 `format` 格式化展示；范围值以 `~` 连接，空值展示 `previewTextPlaceholder`。

## 注意事项

- 字段值是 dayjs 对象，提交给后端前可以在 `onSubmit` 中统一 `format('YYYY-MM-DD')`。
- 需要通过 Schema 传入初始值时，请使用 `dayjs('2026-11-17')`，而不是字符串。
