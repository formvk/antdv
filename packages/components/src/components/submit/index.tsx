import type { IFormFeedback } from '@formvk/core'
import { useParentForm } from '@formvk/vue'
import { Button } from 'antdv-next'
import type { ButtonProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export interface ISubmitProps {
  onClick?: (e: MouseEvent) => any
  onSubmit?: (values: any) => any
  onSubmitSuccess?: (payload: any) => void
  onSubmitFailed?: (feedbacks: IFormFeedback[]) => void
  loading?: boolean
}

export const Submit = defineComponent<ButtonProps & ISubmitProps>({
  name: 'Submit',
  inheritAttrs: false,
  props: {
    onClick: Function as PropType<(e: MouseEvent) => any>,
    onSubmit: Function as PropType<(values: any) => any>,
    onSubmitSuccess: Function as PropType<(payload: any) => void>,
    onSubmitFailed: Function as PropType<(feedbacks: IFormFeedback[]) => void>,
    loading: { type: Boolean, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const form = useParentForm()
    return () => (
      <Button
        {...attrs}
        htmlType={props.onSubmit ? 'button' : 'submit'}
        type={(attrs.type as any) ?? 'primary'}
        loading={props.loading !== undefined ? props.loading : form.value?.submitting}
        onClick={(e: MouseEvent) => {
          if (props.onClick) {
            if ((props.onClick(e) as any) === false) return
          }
          if (props.onSubmit && form.value) {
            form.value.submit(props.onSubmit).then(props.onSubmitSuccess).catch(props.onSubmitFailed)
          }
        }}
      >
        {slots.default?.()}
      </Button>
    )
  },
})
