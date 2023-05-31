import type { App } from 'vue'

const sessionStorage = useSessionStorage('config', {
  OPEN_REGISTER: false,
  WEBSITE_TITLE: 'MBlog',
  USER_MODEL: 'SINGLE',
  OPEN_COMMENT: false,
  OPEN_LIKE: false,
  ANONYMOUS_COMMENT: false,
})
const userinfo = useLocalStorage('userinfo', { userId: 0 })

export const installDirectives = (app: App<Element>) => {
  app.directive('openRegister', {
    mounted: (el: Element) => {
      if (sessionStorage.value.OPEN_REGISTER !== true) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })

  app.directive('openComment', {
    mounted: (el: Element) => {
      if (sessionStorage.value.OPEN_COMMENT !== true) {
        el.parentNode && el.parentNode.removeChild(el)
        return
      }
      if (!userinfo.value.userId && sessionStorage.value.ANONYMOUS_COMMENT === false) {
        el.parentNode && el.parentNode.removeChild(el)
        return
      }
    },
  })

  app.directive('openLike', {
    mounted: (el: Element) => {
      if (sessionStorage.value.OPEN_LIKE !== true) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })
}
