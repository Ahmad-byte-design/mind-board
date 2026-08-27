import { usePages } from '../hooks'
import { usePageSelection } from '../hooks'
import SidebarHeader from './SidebarHeader'
import NewPageButton from './NewPageButton'
import PageList from './PageList'
import OfflineNotice from './OfflineNotice'
import type { Page } from '../types/page.types'

interface NotebookPanelProps {
  isOnline: boolean
  onCollapse?: () => void
  onCloseMobile?: () => void
  onSelectPage?: (id: number) => void
  onOpenCreate: () => void
  onRename: (page: Page) => void
  onDelete: (page: Page) => void
}

const noop = () => {}

export default function NotebookPanel({
  isOnline,
  onCollapse,
  onCloseMobile,
  onSelectPage,
  onOpenCreate,
  onRename,
  onDelete,
}: NotebookPanelProps) {
  const pagesQuery = usePages()
  const pages = pagesQuery.data?.pages.flatMap((group) => group.data) ?? []
  const { selectedPageId, selectPage } = usePageSelection({
    pages,
    isLoading: pagesQuery.isLoading,
  })

  const handleSelect = (id: number) => {
    selectPage(id)
    onSelectPage?.(id)
  }

  return (
    <div className="notebook-texture flex h-full flex-col overflow-hidden">
      <SidebarHeader onCollapse={onCollapse ?? noop} onCloseMobile={onCloseMobile} />
      <NewPageButton onClick={onOpenCreate} />
      <PageList
        selectedPageId={selectedPageId}
        onSelect={handleSelect}
        onRename={onRename}
        onDelete={onDelete}
        onCreate={onOpenCreate}
      />
      <OfflineNotice isOnline={isOnline} />
    </div>
  )
}