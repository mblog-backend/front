<template>
  <div class="memo" :class="{ top: props.memo.top === 'Y' }">
    <div class="header">
      <div class="date">{{ dayjs(props.memo.created).format('YYYY-MM-DD HH:mm:ss') }}</div>
      <div class="author" @click="searchMemosBus.emit({ userId: props.memo.userId, username: props.memo.authorName })">
        @{{ props.memo.authorName }}
      </div>
      <div class="visibility" @click="searchMemosBus.emit({ visibility: props.memo.visibility })">
        {{ getVisbilityDesc(props.memo.visibility) }}
      </div>
      <div v-if="props.memo.top === 'Y'" class="fw-700">已置顶</div>

      <div
        class="fr gap-1 items-center cursor-pointer hover:text-blue-600 ml-auto"
        @click="navTo('/memo/' + props.memo.id)"
        title="查看详情"
        v-if="route.path === '/' && !userinfo.token"
      >
        <div class="i-carbon:book"></div>
      </div>

      <n-popover
        trigger="manual"
        placement="left"
        :show="popoverShow"
        @clickoutside="popoverShow = false"
        v-if="userinfo.token && route.path === '/'"
      >
        <template #trigger>
          <div class="detail" @click="popoverShow = !popoverShow"></div>
        </template>
        <div class="fc gap-1">
          <div
            v-if="props.memo.userId === userinfo.userId"
            class="fr gap-1 items-center cursor-pointer hover:text-blue-600"
            @click="editMemo()"
          >
            <div class="i-carbon:edit"></div>
            <div>编辑</div>
          </div>
          <div
            class="fr gap-1 items-center cursor-pointer hover:text-blue-600"
            v-if="route.path === '/'"
            @click="navTo('/memo/' + props.memo.id)"
          >
            <div class="i-carbon:book"></div>
            <div>详情</div>
          </div>
          <div
            v-if="props.memo.top === 'N' && userinfo.role === 'ADMIN'"
            class="fr gap-1 items-center cursor-pointer hover:text-blue-600"
            @click="setMemoTop(props.memo.id, 'Y')"
          >
            <div class="i-carbon:up-to-top"></div>
            <div>置顶</div>
          </div>
          <div
            v-if="userinfo.role === 'ADMIN' && props.memo.top === 'Y'"
            class="fr gap-1 items-center cursor-pointer hover:text-blue-600"
            @click="setMemoTop(props.memo.id, 'N')"
          >
            <div class="i-carbon:down-to-bottom"></div>
            <div>取消置顶</div>
          </div>
          <n-popconfirm
            :show-icon="false"
            v-if="props.memo.userId === userinfo.userId"
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
    <div class="content md-content" v-html="props.memo && props.memo.content && marked.parse(props.memo.content)"></div>

    <div class="fr gap-2 px-2 mb-2 flex-wrap" v-if="props.memo.resources">
      <n-image-group>
        <n-space>
          <n-image
            v-for="(img, index) in props.memo.resources"
            class="rd hover:shadow-2xl"
            :key="index"
            width="100"
            height="100"
            lazy
            :src="img.url + (img.suffix || '')"
            :preview-src="img.url"
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
  <div class="flex items-center justify-center mt-4" v-if="route.path !== '/' && !userinfo.token">
    <n-button type="primary" class="px-6" @click="router.push('/')">回首页</n-button>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { mangle } from 'marked-mangle'
import { gfmHeadingId } from 'marked-gfm-heading-id'

import { type MemoDTO, getVisbilityDesc } from '@/types/memo'
import { searchMemosBus, reloadMemosBus } from '@/event/event'
import { useMyFetch } from '@/api/fetch'
import dayjs from 'dayjs'
const options = {
  prefix: 'mblog-',
}

const userinfo = useStorage('userinfo', { token: '', userId: 0, role: '' })
const route = useRoute()

const setMemoTop = async (id: number, top: string) => {
  popoverShow.value = false
  const { error } = await useMyFetch(`/api/memo/setTop?id=${id}&top=${top}`).post().json()
  if (!error.value) {
    const { message } = createDiscreteApi(['message'])
    message.success('操作成功')
    reloadMemosBus.emit()
  }
}

marked.use(gfmHeadingId(options))
marked.use(mangle())

const props = defineProps<{
  memo: MemoDTO
  id: number | string
}>()

const router = useRouter()
const navTo = (path: string) => {
  router.push(path)
}

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
  @apply fc bg-white rd dark:bg-gray-7 dark:text-gray-4;

  &.top {
    @apply shadow-2xl;

    .header {
      @apply bg-blue-50;
    }
  }

  .header {
    @apply bg-gray-50 fr gap-2 text-xs py-2 px-4 text-gray-500 rd-t dark:bg-gray-5 dark:text-gray-9;

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
    overflow-wrap: anywhere;

    &.wrap {
      text-overflow: ellipsis;
      max-height: 300px;
      overflow: hidden;
    }
  }

  .tags {
    @apply fr gap-2 text-xs text-gray-400 pb-2 px-2 items-center;

    .tag {
      @apply cursor-pointer   hover:text-blue-5;
    }
  }
}
</style>
