import { createFetch } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message'])

export const useMyFetch = createFetch({
  baseUrl: import.meta.env.VITE_BASE_URL,
  options: {
    async beforeFetch({ options }) {
      const userinfo = useStorage('userinfo', { token: '' })
      if (userinfo.value.token && options.headers) {
        options.headers = {
          token: userinfo.value.token,
        }
      }
      return { options }
    },
    async afterFetch(ctx) {
      if (ctx.response.status !== 200 || ctx.data.code !== 0) {
        return Promise.reject(new Error(ctx.data?.msg || '系统异常'))
      }
      return Promise.resolve({ data: ctx.data.data })
    },
    async onFetchError(ctx) {
      message.error(ctx.data?.msg || '系统异常')
      return Promise.resolve(ctx)
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
