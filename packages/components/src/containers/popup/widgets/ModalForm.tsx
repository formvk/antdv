import type { PopupModel } from '@formvk/models'
import { Modal } from 'antdv-next'
import type { ModalProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { SchemaForm } from '../../form'

/** 弹窗确认/取消回调的事件联合类型，同时覆盖鼠标与键盘触发 */
export type PopupTriggerEvent = KeyboardEvent | MouseEvent | Event

export interface ModalFormProps extends Omit<ModalProps, 'open' | 'onOk' | 'onCancel' | 'confirmLoading'> {
  /** 弹窗表单模型，内部复用模型创建的 form 实例 */
  popup: PopupModel
  schema?: any
  scope?: Record<string, unknown>
  components?: Record<string, any>
  onOk?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  onCancel?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
}

export const ModalForm = defineComponent<ModalFormProps>({
  name: 'ModalForm',
  inheritAttrs: false,
  props: {
    popup: { type: Object as PropType<PopupModel>, required: true },
    schema: Object,
    scope: Object as PropType<Record<string, unknown>>,
    components: Object as PropType<Record<string, any>>,
    onOk: Function as PropType<ModalFormProps['onOk']>,
    onCancel: Function as PropType<ModalFormProps['onCancel']>,
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
      <Modal
        {...attrs}
        open={props.popup.visible}
        confirmLoading={props.popup.form.submitting}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <SchemaForm form={props.popup.form} schema={props.schema} scope={props.scope} components={props.components}>
          {slots.default?.()}
        </SchemaForm>
      </Modal>
    )
  },
})
