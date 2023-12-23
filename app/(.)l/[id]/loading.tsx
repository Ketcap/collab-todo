import { InterceptingModal } from "../../../components/intercepting-modal/intercepting-modal";
import { DialogHeader } from "../../../components/ui/dialog";
import { Skeleton } from "../../../components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <DialogHeader>
        <Skeleton className="w-[50%] h-[25px] rounded-full" />
        <Skeleton className="w-[100%] h-[20px] rounded-full" />
      </DialogHeader>
      <Skeleton className="w-[100%] h-[40px] rounded-full" />
      <Skeleton className="w-[100%] h-[30px] rounded-full" />
      <Skeleton className="w-[100%] h-[30px] rounded-full" />
      <Skeleton className="w-[100%] h-[30px] rounded-full" />
      <Skeleton className="w-[100%] h-[30px] rounded-full" />
    </>
  );
}
