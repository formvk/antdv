import { InboxOutlined, UploadOutlined } from '@antdv-next/icons'
import type { Field } from '@formvk/core'
import { isArr, toArr } from '@formvk/shared'
import { connect, mapProps, useField } from '@formvk/vue'
import { Button, Upload as AntUpload, UploadDragger as AntUploadDragger } from 'antdv-next'
import { defineComponent, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'

import { cls, useFieldModel, usePrefixCls } from '../../shared'
import { UPLOAD_PLACEHOLDER } from './placeholder'
import { useStyle } from './style'

export interface IUploadProps {
  fileList?: any[]
  textContent?: VNodeChild
  onChange?: (fileList: any[]) => void
  serviceErrorMessage?: string
  listType?: string
}

export type IDraggerUploadProps = IUploadProps

const testOpts = (ext: RegExp, options: { exclude?: string[]; include?: string[] }) => {
  if (options && isArr(options.include)) {
    return options.include.some(url => ext.test(url))
  }
  if (options && isArr(options.exclude)) {
    return !options.exclude.some(url => ext.test(url))
  }
  return true
}

const getImageByUrl = (url: string, options: any) => {
  for (let i = 0; i < UPLOAD_PLACEHOLDER.length; i++) {
    if (UPLOAD_PLACEHOLDER[i].ext.test(url) && testOpts(UPLOAD_PLACEHOLDER[i].ext, options)) {
      return UPLOAD_PLACEHOLDER[i].icon || url
    }
  }
  return url
}

const getURL = (target: any) => target?.['url'] || target?.['downloadURL'] || target?.['imgURL']
const getThumbURL = (target: any) =>
  target?.['thumbUrl'] || target?.['url'] || target?.['downloadURL'] || target?.['imgURL']

const getErrorMessage = (target: any) => {
  return (
    target?.errorMessage ||
    target?.errMsg ||
    target?.errorMsg ||
    target?.message ||
    (typeof target?.error === 'string' ? target.error : '')
  )
}

const getState = (target: any) => {
  if (target?.success === false) return 'error'
  if (target?.failed === true) return 'error'
  if (target?.error) return 'error'
  return target?.status || target?.state
}

const normalizeFileList = (fileList?: any[]) => {
  if (fileList && fileList.length) {
    return fileList.map((file, index) => {
      return {
        ...file,
        uid: file.uid || `${index}`,
        status: getState(file.response) || getState(file) || 'done',
        url: getURL(file) || getURL(file?.response),
        thumbUrl: getImageByUrl(getThumbURL(file) || getThumbURL(file?.response), {
          exclude: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.icon', '.tif', '.tiff'],
        }),
      }
    })
  }
  return []
}

const useUploadValidator = (serviceErrorMessage = 'Upload Service Error') => {
  const field = useField<Field>()
  watch(
    () => field.value?.value,
    value => {
      const list = toArr(value)
      let message = ''
      for (let i = 0; i < list.length; i++) {
        const item: any = list[i]
        if (item?.status === 'error' || item?.status === 'fail') {
          message = getErrorMessage(item?.response) || getErrorMessage(item) || serviceErrorMessage
          break
        }
      }
      field.value?.setFeedback({
        type: 'error',
        code: 'UploadError',
        messages: message ? [message] : [],
      })
    }
  )
}

const modelProp = { type: null as unknown as PropType<any>, default: undefined }

const UploadWrapper = defineComponent({
  name: 'Upload',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
    fileList: { type: Array as PropType<any[]>, default: undefined },
    textContent: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    onChange: Function as PropType<(fileList: any[]) => void>,
    serviceErrorMessage: String,
    listType: String,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    useUploadValidator(props.serviceErrorMessage)
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => {
      const { onChange: originChange, value: _value, ...rest } = attrs
      const handleChange = (info: any) => {
        const list = normalizeFileList(info?.fileList)
        ;(originChange as any)?.(list)
        setValue(list)
      }
      const placeholder =
        props.listType !== 'picture-card' ? (
          <Button icon={<UploadOutlined />}>{props.textContent as VNodeChild}</Button>
        ) : null
      return (
        <AntUpload
          {...(rest as any)}
          fileList={normalizeFileList(value.value ?? props.fileList)}
          listType={props.listType as any}
          onChange={handleChange}
        >
          {slots.default?.() ?? placeholder}
        </AntUpload>
      )
    }
  },
})

const DraggerWrapper = defineComponent({
  name: 'UploadDragger',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
    fileList: { type: Array as PropType<any[]>, default: undefined },
    textContent: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    onChange: Function as PropType<(fileList: any[]) => void>,
    serviceErrorMessage: String,
    listType: String,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const prefixCls = usePrefixCls('upload-dragger')
    const hashId = useStyle(prefixCls)
    useUploadValidator(props.serviceErrorMessage)
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => {
      const { onChange: originChange, value: _value, ...rest } = attrs
      const handleChange = (info: any) => {
        const list = normalizeFileList(info?.fileList)
        ;(originChange as any)?.(list)
        setValue(list)
      }
      return (
        <div class={cls(prefixCls, hashId.value)}>
          <AntUploadDragger
            {...(rest as any)}
            fileList={normalizeFileList(value.value ?? props.fileList)}
            onChange={handleChange}
          >
            {slots.default?.() ?? (
              <>
                <p class="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                {props.textContent && <p class="ant-upload-text">{props.textContent as VNodeChild}</p>}
              </>
            )}
          </AntUploadDragger>
        </div>
      )
    }
  },
})

export const Upload = connect(
  UploadWrapper,
  mapProps({
    value: 'fileList',
  })
)

export const UploadDragger = connect(
  DraggerWrapper,
  mapProps({
    value: 'fileList',
  })
)
