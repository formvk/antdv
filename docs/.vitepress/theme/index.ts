import DefaultTheme from 'vitepress/theme'

// antdv-next 的基础重置样式；控件与桥接层样式均由 cssinjs 在运行时注入
// oxlint-disable-next-line import/no-unassigned-import
import 'antdv-next/dist/reset.css'
// oxlint-disable-next-line import/no-unassigned-import
import './custom.css'

export default DefaultTheme
