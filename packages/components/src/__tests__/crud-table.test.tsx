import { TableModel } from '@formvk/models'
import { createSchema } from '@formvk/vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { DataTableProps } from '../index'
import { CrudTable, renders } from '../index'
import { OptionsProvider, f } from './helpers'

interface IRecord {
  id: number
  name: string
}

const records: IRecord[] = [
  { id: 1, name: 'alice' },
  { id: 2, name: 'bob' },
]

const createTable = () =>
  new TableModel<IRecord>({
    state: { count: records.length },
    search: async () => records,
  })

describe('CrudTable', () => {
  it('渲染搜索表单、数据列与分页', async () => {
    const table = createTable()
    await table.onSearch()

    const searchSchema = createSchema({
      keyword: f.Input({ title: '关键字' }),
    })

    const columns: DataTableProps<IRecord>['columns'] = [
      { label: '名称', prop: 'name', width: 120, render: renders.text() },
    ]

    const wrapper = mount(() => (
      <OptionsProvider>
        <CrudTable table={table} row-key="id" search={searchSchema} columns={columns} />
      </OptionsProvider>
    ))

    await new Promise(resolve => setTimeout(resolve, 0))

    const html = wrapper.html()
    expect(html).toContain('关键字')
    expect(html).toContain('alice')
    expect(html).toContain('bob')
    // 分页在 total 大于 0 时由 antd Pagination 渲染
    expect(html).toContain('ant-pagination')

    wrapper.unmount()
  })
})
