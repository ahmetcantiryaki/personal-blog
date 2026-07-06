import { Skeleton } from '@/components/ui/skeleton'

interface PostGridSkeletonProps {
  count?: number
}

/** Placeholder grid shown while a listing loads. */
export function PostGridSkeleton({ count = 6 }: PostGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border/70 bg-card">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
