<template>
  <OptionsProvider>
    <div :style="stackStyle">
      <Form :form="form" layout="vertical">
        <SchemaField :schema="schema" />
      </Form>
      <div>
        <div :style="sectionTitleStyle">阅读态（readPretty）</div>
        <Form :form="readPrettyForm" layout="vertical" preview-text-placeholder="—">
          <SchemaField :schema="schema" />
        </Form>
      </div>
    </div>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antdv'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import dayjs from 'dayjs'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  basic: f.TimePicker({ title: '时间' }),
  format: f.TimePicker({ title: '自定义格式', componentProps: { format: 'HH:mm' } }),
  step: f.TimePicker({ title: '15 分钟步长', componentProps: { minuteStep: 15 } }),
  range: f.TimeRangePicker({ title: '时间范围' }),
})

const createInitialValues = () => ({
  basic: dayjs('10:30:00', 'HH:mm:ss'),
  format: dayjs('10:30', 'HH:mm'),
  step: dayjs('10:45:00', 'HH:mm:ss'),
  range: [dayjs('09:00:00', 'HH:mm:ss'), dayjs('18:00:00', 'HH:mm:ss')],
})

const form = createForm({ values: createInitialValues() })
const readPrettyForm = createForm({ pattern: 'readPretty', values: createInitialValues() })
const stackStyle = { display: 'grid', gap: '16px' }
const sectionTitleStyle = { marginBottom: '12px', fontWeight: '600' }
</script>
