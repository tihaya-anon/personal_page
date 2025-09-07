import { CardAction, CardDescription, CardTitle } from "#/ui/card";
import FlexCard from "#/flex-card";
import { type CardInfo, getEduInfo } from "@/api/card-api";
import { useEffect, useState } from "react";
import LoadingCard from "#/loading-card";

export default function EduCard(props: React.ComponentProps<"div">) {
  const [info, setInfo] = useState<CardInfo>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { title, description, action, content, footer } = info;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getEduInfo();
        setInfo(info);
      } catch (error) {
        console.error("Error fetching education card data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  let contentList;
  if (content instanceof Array) {
    contentList = (
      <div className="flex flex-col gap-4">
        {content.map((item) => {
          return (
            <div key={item.school}>
              <div className="flex flex-row justify-between">
                <p>{item.school}</p>
                <p className="italic">{item.time}</p>
              </div>
              <p className="font-light">{item.major}</p>
            </div>
          );
        })}
      </div>
    );
  }
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
      {contentList}
    </FlexCard>
  );
}
