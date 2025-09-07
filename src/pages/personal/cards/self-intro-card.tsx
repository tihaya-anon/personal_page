import { CardAction, CardDescription, CardTitle } from "#/ui/card";
import FlexCard from "#/flex-card";
import { type CardInfo, getSelfIntroInfo } from "@/api/card-api";
import { useEffect, useState } from "react";
import LoadingCard from "#/loading-card";

export default function SelfIntroCard(props: React.ComponentProps<"div">) {
  const [info, setInfo] = useState<CardInfo>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { title, description, action, footer } = info;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getSelfIntroInfo();
        setInfo(info);
      } catch (error) {
        console.error("Error fetching self intro card data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return loading ? (
    <LoadingCard {...props} />
  ) : (
    <FlexCard
      {...props}
      header={
        <>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>{action}</CardAction>
        </>
      }
      footer={
        <>
          <p>{footer}</p>
        </>
      }
    >
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-5xl">₍^. .^₎⟆</p>
      </div>
    </FlexCard>
  );
}
