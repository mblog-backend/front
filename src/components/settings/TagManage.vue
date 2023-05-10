<template>
  <div>
    <n-data-table :columns="columns" :data="tags" :bordered="false" />
    <div class="flex items-center justify-center mt-2">
      <n-button type="primary" @click="saveTag">保存标签</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '@/types/tag'
import { NButton, type DataTableColumns, NInput } from 'naive-ui'

const columns: DataTableColumns<Tag> = [
  {
    title: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: '标签名称',
    key: 'name',
    align: 'center',
    width: '200',
    render(row, index) {
      return h(NInput, {
        value: row.name,
        onUpdateValue(v) {
          tags.value[index].name = v
          tags.value[index].edited = true
        },
      })
    },
  },
  {
    title: '引用计数',
    key: 'count',
    align: 'center',
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row) {
      if (row.count > 0) {
        return
      }
      return h(
        NButton,
        {
          type: 'error',
          strong: true,
          size: 'small',
          onClick: () => {
            removeTag(row.id)
          },
        },
        { default: () => '删除' }
      )
    },
  },
]

const tags = ref<Array<Tag>>([])

onMounted(async () => {
  await reload()
})
const { message } = createDiscreteApi(['message'])

const removeTag = async (id: number) => {
  const { error } = await useMyFetch('/api/tag/remove?id=' + id)
    .post()
    .json()
  if (error.value) return
  message.success('删除标签成功！')
  await reload()
}

const reload = async () => {
  const { data, error } = await useMyFetch('/api/tag/list').post().json()
  if (error.value) return
  console.log(data.value)
  tags.value = data.value
}

const saveTag = async () => {
  if (
    new Set(
      tags.value.map(({ name }) => {
        return name
      })
    ).size != tags.value.length
  ) {
    message.error('存在名称相同的标签!')
    return
  }
  const updatedTags = tags.value
    .filter((r) => r.edited)
    ?.map(({ id, name }) => {
      return { id, name }
    })
  if (updatedTags && updatedTags.length > 0) {
    console.log(updatedTags)
    const { error } = await useMyFetch('/api/tag/save')
      .post({
        list: updatedTags,
      })
      .json()
    if (error.value) return
    message.success('保存标签成功！')
    await reload()
  } else {
    message.success('保存标签成功！')
  }
}
</script>

<style scoped></style>
