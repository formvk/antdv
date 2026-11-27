import { message } from 'antdv-next'
import type { VNodeChild } from 'vue'

export const loading = async (title: VNodeChild = 'Loading...', processor: () => Promise<any>) => {
  let close: (() => void) | undefined
  const timer = setTimeout(() => {
    close = message.loading({
      content: typeof title === 'string' ? title : 'Loading...',
      duration: 0,
    })
  }, 100)
  try {
    return await processor()
  } finally {
    clearTimeout(timer)
    close?.()
  }
}
