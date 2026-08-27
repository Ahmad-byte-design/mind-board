import { Skeleton } from '@/components/ui'

export default function PageCardSkeleton() {
  return (
    <div className="relative rounded-xl border border-border-paper/50 bg-paper/70 px-4 py-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2.5">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}