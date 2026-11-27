<template>
  <OptionsProvider>
    <Form :form="form" layout="vertical">
      <SchemaField :schema="schema" />
    </Form>
  </OptionsProvider>
</template>

<script setup lang="ts">
import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antdv'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/vue'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  basic: f.Upload({
    title: '基础上传',
    componentProps: {
      action: '#',
      // beforeUpload 返回 false 时仅收集文件，不发起上传请求
      beforeUpload: () => false,
      textContent: '选择文件',
    },
  }),
  dragger: f.UploadDragger({
    title: '拖拽上传',
    componentProps: {
      action: '#',
      beforeUpload: () => false,
      textContent: '点击或拖拽文件到此区域',
    },
  }),
  multiple: f.Upload({
    title: '多文件 + 限制数量',
    componentProps: {
      action: '#',
      beforeUpload: () => false,
      multiple: true,
      maxCount: 3,
      textContent: '最多 3 个文件',
    },
  }),
  picture: f.Upload({
    title: '图片卡片',
    componentProps: {
      action: '#',
      beforeUpload: () => false,
      listType: 'picture-card',
    },
  }),
})

const form = createForm({
  values: {
    basic: [{ uid: '1', name: 'readme.md', status: 'success', url: '#' }],
  },
})
</script>
