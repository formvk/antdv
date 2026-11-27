# Upload

文件上传组件，基于 Ant Design Vue Next `Upload` 封装，字段值为规范化后的文件列表。同包导出拖拽形态的 `UploadDragger`。

<demo vue="../demos/upload.vue" title="Upload 示例" description="按钮上传、拖拽上传、数量限制与图片卡片" />

## 何时使用

- 需要上传一个或多个文件，并把文件列表作为表单字段提交。
- 需要拖拽上传区域时使用 `UploadDragger`。
- 仅做文件收集、上传请求由业务统一处理时，配置 `beforeUpload: () => false`。

## 属性

继承 Ant Design Vue Next [`Upload`](https://antdv-next.com/components/upload) 的属性，并扩展了两个属性；其余属性与 `Upload` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `UploadFile[]` | 文件列表，由内核注入并映射到 `fileList` |
| `textContent` | `VNodeChild` | 本包扩展，上传按钮或拖拽区的文案 |
| `serviceErrorMessage` | `string` | 本包扩展，文件上传失败时的统一错误提示 |
| `action` | `string` | 上传地址 |
| `beforeUpload` | `(file) => boolean \| Promise` | 返回 `false` 时仅收集文件，不发起上传请求 |
| `multiple` | `boolean` | 是否允许多文件 |
| `maxCount` | `number` | 最大文件数 |
| `listType` | `'text' \| 'picture' \| 'picture-card'` | 文件列表展示形态 |
| `accept` | `string` | 接受的文件类型 |

### UploadDragger

`UploadDragger` 为独立具名导出，基于 `Upload` 的拖拽模式，属性与 `Upload` 相同：

```ts
import { fieldComponents } from '@formvk/antdv'

const { Upload, UploadDragger } = fieldComponents
```

`fieldComponents` 已包含两者，直接使用 `f.Upload({ ... })` / `f.UploadDragger({ ... })` 即可。

## 注意事项

- 文件列表在注入内核前会经过规范化：自动补齐 `uid`、根据响应体推断 `status` 与 `url` / `thumbUrl`，字段值可以直接持久化。
- 任一个文件状态为 `error` / `fail` 时，字段会自动写入一条 `UploadError` 校验反馈，提示文案取 `serviceErrorMessage`。
- `Upload` 未内置阅读态渲染，`readPretty` 模式下仍展示文件列表。
