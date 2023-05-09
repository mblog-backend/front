<template>
  <div class="rd bg-white p-2">
    <div class="w-2/3 mx-auto">
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formValue.username" placeholder="输入用户名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="formValue.password" placeholder="输入密码" type="password" />
        </n-form-item>
        <n-form-item label="确认密码" path="repeatPassword">
          <n-input v-model:value="formValue.repeatPassword" placeholder="输入确认密码" type="password" />
        </n-form-item>
        <n-form-item label="昵称" path="displayName">
          <n-input v-model:value="formValue.displayName" placeholder="可不填写,不填写取`用户名`" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formValue.email" placeholder="可不填写" />
        </n-form-item>
        <n-form-item label="个人介绍" path="bio">
          <n-input
            v-model:value="formValue.bio"
            type="textarea"
            :rows="5"
            clearable
            show-count
            placeholder="个人介绍,可不填写,支持markdown"
          />
        </n-form-item>
        <n-form-item>
          <n-space align="center">
            <n-button attr-type="button" type="primary" @click="doRegister"> 注册用户 </n-button>
            <n-button text attr-type="button" type="info" @click="() => {}">
              <RouterLink to="/login">去登录</RouterLink>
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { RegisterUserDTO } from '@/types/user'

const formValue: Partial<RegisterUserDTO> = reactive({})
const validatePasswordSame = (rule: FormItemRule, value: string) => {
  return value === formValue.password
}

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
  repeatPassword: [
    {
      required: true,
      message: '重复密码必填',
      trigger: ['blur'],
    },
    {
      validator: validatePasswordSame,
      message: '两次密码不一致',
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

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const doRegister = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const { error } = useMyFetch('/api/user/register').post(formValue).json()
      if (!error.value) {
        const { message } = createDiscreteApi(['message'])
        message.success('注册成功,快去登录吧!', {
          onLeave: () => {
            router.push('/login')
          },
        })
      }
    }
  })
}
</script>

<style scoped></style>
