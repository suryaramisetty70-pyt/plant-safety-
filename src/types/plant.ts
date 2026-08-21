export interface BotanicalInformation {
  title: string;
  scientificName?: string;
  summary: string;
  imageUrl?: string;
  wikipediaUrl: string;
  source: "wikipedia" | "demo";
}

export interface ScanHistory {
  id: string;
  thumbnail: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: string;
  healthScore: number;
  scannedAt: string;
}
