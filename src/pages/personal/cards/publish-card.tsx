import { CardAction, CardDescription, CardTitle } from "#/ui/card";
import FlexCard from "#/flex-card";
import { type CardInfo, getPublishInfo } from "@/api/card-api";
import { useEffect, useState } from "react";
import LoadingCard from "#/loading-card";

export default function PublishCard(props: React.ComponentProps<"div">) {
  const [info, setInfo] = useState<CardInfo>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { title, description, action, content, footer } = info;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getPublishInfo();
        setInfo(info);
      } catch (error) {
        console.error("Error fetching publish card data:", error);
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
      {content as string}
    </FlexCard>
  );
}
