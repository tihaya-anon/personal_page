import { AUTHOR_NAME } from "@/constants/strings";

export type CardInfo = {
  title?: string;
  description?: string;
  action?: string;
  content?: string | EduInfo[];
  footer?: string;
};
export type EduInfo = {
  school: string;
  time: string;
  major: string;
};
type CardDatabase = {
  [key: string]: CardInfo;
};

// Cache for storing fetched data
let cardCache: CardDatabase | null = null;

// Fallback data in case fetch fails
const fallbackData: CardDatabase = {
  education: {
    title: "Education",
    description: "Education Description",
    action: "Education Action",
    content: "Education Content",
    footer: "Education Footer",
  },
  publish: {
    title: "Publish",
    description: "Publish Description",
    action: "Publish Action",
    content: "Publish Content",
    footer: "Publish Footer",
  },
  "self-intro": {
    title: AUTHOR_NAME,
    description: "Self Intro Description",
    content: "Self Intro Content",
    footer: "Self Intro Footer",
  },
};

// Fetch all card data from JSON database
const fetchCardData = async (): Promise<CardDatabase> => {
  // Return cached data if available
  if (cardCache) {
    return cardCache;
  }

  try {
    const response = await fetch("/data/cards-db.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch card data: ${response.statusText}`);
    }

    const data: CardDatabase = await response.json();

    // Update cache
    cardCache = data;
    return data;
  } catch (error) {
    console.error("Error fetching card data:", error);
    // Return fallback data if fetch fails
    return fallbackData;
  }
};

// Get specific card info by key
const getCardInfo = async (key: string): Promise<CardInfo> => {
  const data = await fetchCardData();
  return data[key] || {};
};

// Specific card getter functions
const getEduInfo = async (): Promise<CardInfo> => {
  return getCardInfo("education");
};

const getPublishInfo = async (): Promise<CardInfo> => {
  return getCardInfo("publish");
};

const getSelfIntroInfo = async (): Promise<CardInfo> => {
  const cardInfo = await getCardInfo("self-intro");
  if (!cardInfo.title) {
    cardInfo.title = AUTHOR_NAME;
  }
  return cardInfo;
};

export { getEduInfo, getPublishInfo, getSelfIntroInfo };
