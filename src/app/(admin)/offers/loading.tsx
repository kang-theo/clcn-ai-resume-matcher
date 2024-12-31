import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='p-4 mt-10 space-y-4'>
      <Skeleton className='w-[100px] h-[20px] rounded-full' />
      <Skeleton className='w-[200px] h-[20px] rounded-full' />
      <Skeleton className='w-[300px] h-[20px] rounded-full' />
      <Skeleton className='w-[400px] h-[20px] rounded-full' />
    </div>
  );
}
