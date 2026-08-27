import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useActivePage } from '@/features/pages/hooks'
import { usePagesStore } from '@/features/pages/store/pages.store'
import { NotebookSidebar, MobileNotebookDrawer } from '@/features/pages/components'
import { BoardPlaceholder } from '@/features/board/components'
import {
  MOBILE_BREAKPOINT,
  SIDEBAR_COLLAPSED_KEY,
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_WIDTH_KEY,
} from '@/features/pages/constants/pages.constants'

const noop = () => {}

export default function AppLayout() {
  const [width, setWidth] = useLocalStorage<number>(SIDEBAR_WIDTH_KEY, SIDEBAR_DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(SIDEBAR_COLLAPSED_KEY, false)

  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
  const isOnline = useOnlineStatus()
  const { activePage } = useActivePage()

  const isMobileSidebarOpen = usePagesStore((state) => state.isMobileSidebarOpen)
  const setMobileSidebarOpen = usePagesStore((state) => state.setMobileSidebarOpen)

  const openNotebook = () => setMobileSidebarOpen(true)
  const closeNotebook = () => setMobileSidebarOpen(false)

  return (
    <div className="flex h-dvh overflow-hidden">
      {isMobile ? (
        <>
          <BoardPlaceholder page={activePage} isMobile onOpenNotebook={openNotebook} />
          <MobileNotebookDrawer open={isMobileSidebarOpen} isOnline={isOnline} onClose={closeNotebook} />
        </>
      ) : (
        <>
          <NotebookSidebar
            width={width}
            collapsed={collapsed}
            isOnline={isOnline}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            onWidthChange={setWidth}
          />
          <BoardPlaceholder page={activePage} isMobile={false} onOpenNotebook={noop} />
        </>
      )}
    </div>
  )
}