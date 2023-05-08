import type { MemoSearchParam } from '@/types/memo'

export const searchMemosBus = useEventBus<Partial<MemoSearchParam>>('searchMemos')
