<template>
  <div class="rd bg-white p-2 dark:bg-gray-700">
    <div class="w-2/3 mx-auto">
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="姓名" path="username">
          <n-input v-model:value="formValue.username" placeholder="输入用户名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="formValue.password" placeholder="输入密码" type="password" />
        </n-form-item>
        <n-form-item>
          <n-space align="center">
            <n-button attr-type="button" type="primary" @click="doLogin"> 登录 </n-button>
            <n-button text attr-type="button" type="info" v-openRegister>
              <RouterLink to="/register" class="dark:text-white">去注册</RouterLink>
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInst | null>(null)
const { message } = createDiscreteApi(['message'])
const userinfo = useStorage('userinfo', { username: '', token: '', role: '' })

const formValue = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '用户名必填',
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '密码必填',
      trigger: ['blur'],
    },
    {
      min: 6,
      max: 20,
      message: '密码必须在6-20位之间',
      trigger: ['blur'],
    },
  ],
}

const doLogin = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { error, data } = await useMyFetch('/api/user/login').post(formValue).json()
      if (!error.value) {
        const target = (route.query.redirect as string) || '/'
        message.success('登录成功,请稍等...', {
          duration: 1000,
          onLeave: () => {
            userinfo.value = data.value
            router.push(target)
          },
        })
      }
    }
  })
}
</script>

<style scoped></style>
