import Skeleton from "../ui/Skeleton";
import Card from "../ui/Card";

export default function CommunityCardSkeleton() {
  return (
    <Card hover>
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[rgba(90,80,60,0.05)] flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full max-w-[420px]" />
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-1 ml-auto">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
        <Skeleton className="h-7 w-14 rounded-lg shrink-0" />
      </div>
    </Card>
  );
}
