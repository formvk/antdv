<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
      <div :style="actionStyle">
        <!-- next/back 会校验当前步骤，并自动切换 display -->
        <Button :disabled="formStep.current === 0" @click="formStep.back()">上一步</Button>
        <Button v-if="formStep.current < LAST_STEP" type="primary" @click="formStep.next()">下一步</Button>
        <Button v-else type="primary" @click="handleSubmit">提交</Button>
      </div>
      <div v-if="result" :style="resultStyle">提交成功：{{ result }}</div>
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, createFormStep, fieldComponents, voidComponents } from '@formvk/antdv'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'
import { Button } from 'antdv-next'
import { ref } from 'vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const LAST_STEP = 2

// 实例与 schema 都放在模块作用域，schema 保持静态
const formStep = createFormStep()

const schema = createSchema({
  steps: f.FormStep({
    componentProps: { formStep },
    properties: {
      first: f.StepPane({
        componentProps: { title: '基本信息', description: '填写账号信息' },
        properties: {
          username: f.Input({ title: '用户名', required: true }),
          password: f.Input({ title: '密码', required: true }),
        },
      }),
      second: f.StepPane({
        componentProps: { title: '联系方式', description: '填写联系信息' },
        properties: {
          email: f.Input({ title: '邮箱', required: true }),
          mobile: f.Input({ title: '手机号' }),
        },
      }),
      third: f.StepPane({
        componentProps: { title: '完成', description: '确认并提交' },
        properties: {
          remark: f.Input({ title: '备注' }),
        },
      }),
    },
  }),
})

const form = createForm()
const result = ref('')
const actionStyle = { display: 'flex', gap: '8px' }
const resultStyle = { marginTop: '12px', color: 'var(--vp-c-green-1, #389e0d)' }

const handleSubmit = () => {
  formStep.submit(values => {
    result.value = JSON.stringify(values)
  })
}
</script>
