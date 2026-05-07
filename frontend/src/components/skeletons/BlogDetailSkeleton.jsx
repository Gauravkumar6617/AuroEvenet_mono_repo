import Skeleton from "../ui/Skeleton";

export default function BlogDetailSkeleton() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2">
          <Skeleton className="w-8 h-4 rounded" />
          <span className="text-[#a09880]">/</span>
          <Skeleton className="w-48 h-4 rounded" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {/* Post skeleton */}
            <div className="surface rounded-2xl p-5">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1.5 shrink-0 pt-1">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="w-6 h-4 rounded" />
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-5 rounded-full" />
                    <Skeleton className="w-24 h-5 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-8 rounded" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-24 h-3 rounded" />
                    <Skeleton className="w-20 h-3 rounded" />
                  </div>
                  <Skeleton className="w-full h-32 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-8 rounded-lg" />
                    <Skeleton className="w-20 h-8 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Answers skeleton */}
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-32 h-6 rounded" />
                <Skeleton className="w-28 h-8 rounded" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-[rgba(90,80,60,0.1)] p-4 bg-white">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="w-5 h-3 rounded" />
                        <Skeleton className="w-5 h-5 rounded" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <Skeleton className="w-24 h-3 rounded" />
                          <Skeleton className="w-16 h-3 rounded" />
                        </div>
                        <Skeleton className="w-full h-16 rounded" />
                        <div className="flex gap-3 pt-1">
                          <Skeleton className="w-12 h-3 rounded" />
                          <Skeleton className="w-12 h-3 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Write answer skeleton */}
            <div className="surface rounded-2xl p-5">
              <Skeleton className="w-32 h-6 rounded mb-3" />
              <Skeleton className="w-full h-36 rounded" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="space-y-4 hidden lg:block">
            <div className="surface rounded-2xl p-4 space-y-3">
              <Skeleton className="w-20 h-3 rounded" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-1.5">
                  <Skeleton className="w-16 h-3 rounded" />
                  <Skeleton className="w-8 h-3 rounded" />
                </div>
              ))}
            </div>
            <div className="surface rounded-2xl p-4 space-y-3">
              <Skeleton className="w-28 h-3 rounded" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="w-24 h-3 rounded" />
                  <Skeleton className="w-32 h-3 rounded" />
                </div>
              </div>
              <Skeleton className="w-full h-8 rounded-lg" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
