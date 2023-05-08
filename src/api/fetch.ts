import { createFetch } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'

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
    async afterFetch({ response, data }) {
      const { message } = createDiscreteApi(['message'])
      if (response.status !== 200 || data.code !== 0) {
        message.error(data.msg || '系统异常')
        return Promise.reject({ response, data })
      }
      return { response, data: data.data }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
