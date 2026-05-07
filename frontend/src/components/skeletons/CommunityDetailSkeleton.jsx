import Skeleton from "../ui/Skeleton";
import Card from "../ui/Card";

export default function CommunityDetailSkeleton() {
  return (
    <div className="pb-20 animate-pulse">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a1814] to-[#2d2820] border-b border-[rgba(90,80,60,0.15)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex items-start gap-5 flex-wrap">
          <Skeleton className="h-20 w-20 rounded-3xl bg-white/10" />
          <div className="flex-1 min-w-0 space-y-3">
            <Skeleton className="h-7 w-48 bg-white/20" />
            <Skeleton className="h-4 w-full max-w-md bg-white/10" />
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-3 w-24 bg-white/10" />
              <Skeleton className="h-3 w-20 bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-xl bg-white/10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main */}
        <div>
          {/* Tabs */}
          <div className="flex items-center justify-between mb-4 border-b border-[rgba(90,80,60,0.1)] pb-0">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="flex gap-1 pb-2">
              <Skeleton className="h-6 w-10 rounded-lg" />
              <Skeleton className="h-6 w-8 rounded-lg" />
              <Skeleton className="h-6 w-8 rounded-lg" />
            </div>
          </div>

          {/* Post cards */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5 space-y-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-14 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center gap-3 pt-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-24 ml-auto" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="space-y-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
          <Card className="space-y-3">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        </div>
      </div>
    </div>
  );
}
