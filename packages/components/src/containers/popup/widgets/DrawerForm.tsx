import type { PopupModel } from '@formvk/models'
import { Button, Drawer, Space } from 'antdv-next'
import type { DrawerProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { SchemaForm } from '../../form'
import type { PopupTriggerEvent } from './ModalForm'

export interface DrawerFormProps extends Omit<DrawerProps, 'open' | 'onClose' | 'footer'> {
  /** 弹窗表单模型，内部复用模型创建的 form 实例 */
  popup: PopupModel
  schema?: any
  scope?: Record<string, unknown>
  components?: Record<string, any>
  onOk?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  onCancel?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  /** 确定按钮文案 */
  okText?: string
  /** 取消按钮文案 */
  cancelText?: string
}

export const DrawerForm = defineComponent<DrawerFormProps>({
  name: 'DrawerForm',
  inheritAttrs: false,
  props: {
    popup: { type: Object as PropType<PopupModel>, required: true },
    schema: Object,
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    onOk: Function as PropType<DrawerFormProps['onOk']>,
    onCancel: Function as PropType<DrawerFormProps['onCancel']>,
    okText: String,
    cancelText: String,
  },
  setup(props, { attrs, slots }) {
    const handleOk = async (e: PopupTriggerEvent) => {
      if ((await props.onOk?.(e)) === false) return
      await props.popup.onSubmit()
    }

    const handleCancel = async (e: PopupTriggerEvent) => {
      if ((await props.onCancel?.(e)) === false) return
      props.popup.close()
    }

    return () => (
      <Drawer
        {...attrs}
        size={(attrs.size as string | number | undefined) ?? 600}
        open={props.popup.visible}
        onClose={(e: MouseEvent | KeyboardEvent) => handleCancel(e)}
      >
        {{
          default: () => (
            <SchemaForm form={props.popup.form} schema={props.schema} scope={props.scope} components={props.components}>
              {slots.default?.()}
            </SchemaForm>
          ),
          footer: () => (
            <Space>
              <Button onClick={(e: MouseEvent) => handleCancel(e)}>{props.cancelText ?? '取消'}</Button>
              <Button type="primary" loading={props.popup.form.submitting} onClick={(e: MouseEvent) => handleOk(e)}>
                {props.okText ?? '确定'}
              </Button>
            </Space>
          ),
        }}
      </Drawer>
    )
  },
})
