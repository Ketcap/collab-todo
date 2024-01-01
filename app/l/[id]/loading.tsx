import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-[100%] max-w-[500px]">
      <CardContent>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[100%] h-[40px] rounded-full" />
          <Skeleton className="w-[100%] h-[30px] rounded-full" />
          <Skeleton className="w-[100%] h-[30px] rounded-full" />
          <Skeleton className="w-[100%] h-[30px] rounded-full" />
          <Skeleton className="w-[100%] h-[30px] rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
