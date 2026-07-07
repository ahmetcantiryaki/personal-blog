import { Skeleton } from '@/components/ui/skeleton'

/** Article-shaped loading fallback. */
export default function PostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-52" />
      </div>
      <div className="mt-10 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
