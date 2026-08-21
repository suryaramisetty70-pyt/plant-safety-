import type { BotanicalInformation } from "@/types/plant";

const WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1";

export async function getBotanicalInformation(
  plantName: string
): Promise<BotanicalInformation> {
  const encodedName = encodeURIComponent(plantName.trim());

  try {
    const response = await fetch(
      `${WIKIPEDIA_API}/page/summary/${encodedName}`
    );

    if (!response.ok) {
      throw new Error("Wikipedia article not found");
    }

    const data = await response.json();

    return {
      title: data.title,
      summary: data.extract || "No botanical summary is available.",
      imageUrl: data.thumbnail?.source,
      wikipediaUrl:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodedName}`,
      source: "wikipedia"
    };
  } catch {
    return {
      title: plantName,
      summary:
        "Live botanical information is currently unavailable. Connect your backend or check your network connection.",
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodedName}`,
      source: "demo"
    };
  }
}
