import FlexCard from "#/flex-card";
import { Skeleton } from "@/components/ui/skeleton";
export default function LoadingCard(props: React.ComponentProps<"div">) {
  return (
    <FlexCard {...props} header={<Skeleton className="w-full h-12" />} footer={<Skeleton className="w-full h-12" />}>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    </FlexCard>
  );
}
