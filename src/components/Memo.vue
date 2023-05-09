<template>
  <div class="memo">
    <div class="header">
      <div class="date">2023-05-08 17:56</div>
      <div class="author" @click="searchMemosBus.emit({ userId: props.memo.userId, username: props.memo.authorName })">
        @{{ props.memo.authorName }}
      </div>
      <div class="visibility" @click="searchMemosBus.emit({ visibility: props.memo.visibility })">
        {{ getVisbilityDesc(props.memo.visibility) }}
      </div>
      <n-popover trigger="manual" placement="left" :show="popoverShow" @clickoutside="popoverShow = false">
        <template #trigger>
          <div class="detail" @click="popoverShow = !popoverShow"></div>
        </template>
        <div class="fc gap-1">
          <div class="fr gap-1 items-center cursor-pointer hover:text-blue-600" @click="editMemo()">
            <div class="i-carbon:edit"></div>
            <div>编辑</div>
          </div>
          <div class="fr gap-1 items-center cursor-pointer hover:text-blue-600">
            <div class="i-carbon:book"></div>
            <div>详情</div>
          </div>
          <n-popconfirm
            :show-icon="false"
            @positive-click="removeMemo(props.memo.id)"
            negative-text="取消"
            positive-text="确定"
          >
            <template #trigger>
              <div class="fr gap-1 items-center cursor-pointer hover:text-blue-600">
                <div class="i-carbon:trash-can"></div>
                <div>删除</div>
              </div>
            </template>
          </n-popconfirm>
        </div>
      </n-popover>
    </div>
    <div class="content" v-text="props.memo.content"></div>

    <div class="fr gap-2 px-2 mb-2 flex-wrap" v-if="props.memo.resources">
      <n-image-group>
        <n-space>
          <n-image
            v-for="(img, index) in props.memo.resources"
            :key="index"
            width="100"
            height="100"
            lazy
            :src="img.url"
            :intersection-observer-options="{
              root: '#image-scroll-container',
            }"
          >
            <template #placeholder>
              <div
                style="
                  width: 100px;
                  height: 100px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #0001;
                "
              >
                加载中...
              </div>
            </template>
          </n-image>
        </n-space>
      </n-image-group>
    </div>
    <div class="tags">
      <div class="tag" v-for="tag in tags" :key="tag" @click="searchMemosBus.emit({ tag: tag })">{{ tag }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MemoDTO, getVisbilityDesc } from '@/types/memo'
import { searchMemosBus, reloadMemosBus } from '@/event/event'
import { useMyFetch } from '@/api/fetch'
const props = defineProps<{
  memo: MemoDTO
}>()

const tags = computed(() => {
  return props.memo.tags?.split(',')
})

const popoverShow = ref(false)

const removeMemo = async (id: number) => {
  const { error } = await useMyFetch(`/api/memo/remove?id=${id}`).post().json()
  if (!error.value) {
    const { message } = createDiscreteApi(['message'])
    message.success('删除成功')
    changedMemoBus.emit()
    reloadMemosBus.emit()
  }
}

const editMemo = () => {
  editMemoBus.emit(props.memo)
  popoverShow.value = false
}
</script>

<style scoped lang="scss">
.memo {
  @apply fc bg-white rd;

  .header {
    @apply bg-gray-50 fr gap-2 text-xs py-2 px-4 text-gray-500;

    .author,
    .visibility {
      @apply cursor-pointer hover:text-blue-4;
    }

    .detail {
      @apply i-carbon:table ml-auto text-gray-400 cursor-pointer hover:text-gray-700;
    }
  }

  .content {
    @apply py-2 px-4;
  }

  .tags {
    @apply fr gap-2 text-xs text-gray-400 pb-2 px-2 items-center;

    .tag {
      @apply cursor-pointer   hover:text-blue-5;
    }
  }
}
</style>
