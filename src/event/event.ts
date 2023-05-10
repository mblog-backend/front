import type { MemoSearchParam, MemoDTO, MemoSaveParam } from '@/types/memo'

export const searchMemosBus = useEventBus<Partial<MemoSearchParam>>('searchMemos')
export const reloadMemosBus = useEventBus<Partial<MemoSearchParam>>('reloadMemos')
export const editMemoBus = useEventBus<MemoDTO>('editMemo')
export const changedMemoBus = useEventBus<MemoSaveParam>('changedMemo')
export const closeDrawerBus = useEventBus<{}>('closeDrawer')
export const themeChangeBus = useEventBus<{ theme: string }>('themeChange')
