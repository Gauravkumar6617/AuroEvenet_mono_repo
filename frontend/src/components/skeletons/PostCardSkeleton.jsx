import Skeleton from "../ui/Skeleton";
import Card from "../ui/Card";

export default function PostCardSkeleton() {
  return (
    <Card className="p-0 overflow-hidden rounded-2xl animate-pulse">
      <div className="flex">
        {/* Vote column skeleton */}
        <div className="flex flex-col items-center gap-2 px-3 py-4 bg-[rgba(90,80,60,0.03)] border-r border-[rgba(90,80,60,0.07)] shrink-0 min-w-[56px]">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <div className="w-6 h-4 rounded bg-gray-200" />
          <div className="w-4 h-4 rounded bg-gray-200" />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-1 items-start gap-4 p-4">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-4 pt-2">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          <div className="hidden sm:block">
            <Skeleton className="h-20 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </Card>
  );
}
