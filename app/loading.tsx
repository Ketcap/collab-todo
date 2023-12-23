import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-[100%] max-w-[500px]">
      <CardHeader>
        <Skeleton className="w-[50%] h-[25px] rounded-full" />
        <Skeleton className="w-[100%] h-[20px] rounded-full" />
        <Skeleton className="w-[75%] h-[20px] rounded-full" />
      </CardHeader>
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
