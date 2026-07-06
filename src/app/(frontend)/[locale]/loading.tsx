import { PostGridSkeleton } from '@/components/blog/post-grid-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/** Generic route-level loading fallback for locale listing pages. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 space-y-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <Skeleton className="mb-14 h-64 w-full rounded-xl" />
      <PostGridSkeleton />
    </div>
  )
}
