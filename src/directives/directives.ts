import type { App } from 'vue'

const sessionStorage = useSessionStorage('config', {
  OPEN_REGISTER: false,
  WEBSITE_TITLE: 'MBlog',
  USER_MODEL: 'SINGLE',
  OPEN_COMMENT: false,
  OPEN_LIKE: false,
})

export const installDirectives = (app: App<Element>) => {
  app.directive('openRegister', {
    mounted: (el: Element) => {
      if (sessionStorage.value.USER_MODEL !== 'MULTIPLE' || sessionStorage.value.OPEN_REGISTER !== true) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })

  app.directive('openComment', {
    mounted: (el: Element) => {
      if (sessionStorage.value.USER_MODEL !== 'MULTIPLE' || sessionStorage.value.OPEN_COMMENT !== true) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })

  app.directive('openLike', {
    mounted: (el: Element) => {
      if (sessionStorage.value.USER_MODEL !== 'MULTIPLE' || sessionStorage.value.OPEN_LIKE !== true) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })

  app.directive('singleUser', {
    mounted: (el: Element) => {
      if (sessionStorage.value.USER_MODEL !== 'SINGLE') {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })

  app.directive('multipleUser', {
    mounted: (el: Element) => {
      if (sessionStorage.value.USER_MODEL !== 'MULTIPLE') {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })
}
