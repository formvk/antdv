# TimePicker

时间选择组件，基于 Ant Design Vue Next `TimePicker` 封装。字段值为 **dayjs 对象**（与 antdv-next 原生行为一致），阅读态自动切换为 `TextTimePicker`。

<demo vue="../demos/time-picker.vue" title="format / minuteStep / TimeRangePicker" description="时间、自定义格式、步长与范围选择，含 readPretty 阅读态" />

## 何时使用

- 需要录入一天中的某个时间点，且不关心日期。
- 需要选择时间区间时使用同包导出的 `TimeRangePicker`。
- 日期与时间需要一起录入时，使用 [DatePicker](/components/date-picker) 的 `showTime`。

## 属性

继承 Ant Design Vue Next [`TimePicker`](https://antdv-next.com/components/time-picker) 的属性，未列出的属性与 `TimePicker` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `Dayjs` | 字段值（dayjs 对象），由内核注入 |
| `format` | `string` | 展示格式，默认 `HH:mm:ss` |
| `hourStep` | `number` | 小时步长，默认 `1` |
| `minuteStep` | `number` | 分钟步长，默认 `1` |
| `secondStep` | `number` | 秒步长，默认 `1` |
| `allowClear` | `boolean` | 是否展示清除按钮 |
| `disabled` | `boolean` | 禁用选择 |

### TimeRangePicker

`TimeRangePicker` 为独立具名导出，字段值为 `[Dayjs, Dayjs]`，属性与 Ant Design Vue Next 范围选择器一致。

## 阅读态

`readPretty` 模式下，`TimePicker` 与 `TimeRangePicker` 分别切换为 `TextTimePicker` / `TextTimeRangePicker`，按 `format` 格式化展示；范围值以 `~` 连接，空值展示 `previewTextPlaceholder`。

## 注意事项

- 字段值是 dayjs 对象；需要在提交时输出字符串时，在 `onSubmit` 中统一 `format('HH:mm:ss')`。
- 初始化值时使用 `dayjs('10:30:00', 'HH:mm:ss')` 等写法。
