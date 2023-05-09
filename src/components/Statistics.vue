<template>
  <div class="fc bg-white py-4 px-2 rd">
    <div class="fr justify-around gap-4 text-gray mb-2">
      <div class="fc items-center">
        <div class="text-lg text-black">{{ statisticsDTO.totalMemos }}</div>
        <div>Memo</div>
      </div>
      <div class="fc items-center">
        <div class="text-lg text-black">{{ statisticsDTO.totalTags }}</div>
        <div>Tags</div>
      </div>
      <div class="fc items-center">
        <div class="text-lg text-black">{{ statisticsDTO.totalDays }}</div>
        <div>Day</div>
      </div>
    </div>

    <div class="custom-grid">
      <n-tooltip placement="bottom" trigger="hover" v-for="idx in total" :key="idx">
        <template #trigger>
          <div class="grid-item" @click="searchMemoByDay(total - idx)" :style="opacity(total - idx)"></div>
        </template>
        <span>{{ tooltip(total - idx) }}</span>
      </n-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatisticsDTO } from '@/types/memo'
import dayjs from 'dayjs'

onMounted(async () => {
  await reload()
})

interface Request {
  begin: Date
  end: Date
}

const total = 49

const req = ref<Request>({
  begin: dayjs(new Date()).subtract(total, 'd').toDate(),
  end: new Date(),
})

let statisticsDTO = ref<Partial<StatisticsDTO>>({})
const reload = async () => {
  const { data } = await useMyFetch('/api/memo/statistics').post(req).json()
  statisticsDTO.value = data.value
}

saveMemoBus.on(reload)

const tooltip = (idx: number) => {
  const day = dayjs().subtract(idx, 'd').format('YYYY-MM-DD')
  const target = statisticsDTO.value.items?.find((r) => {
    return r.date === day
  })
  if (target) {
    return `${target.total} memos in ${target.date}`
  }
  return day
}

const searchMemoByDay = (idx: number) => {
  const day = dayjs().subtract(idx, 'd')
  searchMemosBus.emit({
    begin: day.startOf('d').toDate(),
    end: day.endOf('d').toDate(),
  })
}

const opacity = (idx: number) => {
  const day = dayjs().subtract(idx, 'd').format('YYYY-MM-DD')
  const target = statisticsDTO.value.items?.find((r) => {
    return r.date === day
  })
  if (target && target.total > 0) {
    return `background-color:green;opacity:${target.total / 10}`
  }
  return ''
}
</script>

<style scoped lang="scss">
.custom-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  grid-column-gap: 5px;
  grid-row-gap: 5px;

  .grid-item {
    @apply w-5 h-5 cursor-pointer hover:bg-gray-400 bg-gray-200 rd;
  }
}
</style>
