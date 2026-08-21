export type Severity = "healthy" | "mild" | "moderate" | "severe" | "critical";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Lesion {
  id: string;
  label: string;
  confidence: number;
  severity: Severity;
  boundingBox: BoundingBox;
  areaPercentage: number;
  color?: string;
}

export interface DiseaseDetection {
  id: string;
  name: string;
  scientificName?: string;
  confidence: number;
  severity: Severity;
  symptoms: string[];
  lesions: Lesion[];
}

export interface PlantHealth {
  healthScore: number;
  healthyTissuePercentage: number;
  lesionDamagePercentage: number;
  diseaseSeverity: number;
  infectionAreaPercentage: number;
  detectionCount: number;
}

export interface Treatment {
  id: string;
  category: "immediate" | "organic" | "chemical" | "prevention";
  title: string;
  description: string;
  steps: string[];
  ppeRequired?: string[];
  beeProtection?: string;
  preHarvestInterval?: string;
  warning?: string;
}

export interface CarePlanItem {
  day: number;
  title: string;
  description: string;
  status: "pending" | "completed" | "skipped";
}

export interface PlantDiagnosis {
  id: string;
  imageUrl: string;
  plantName: string;
  scientificName: string;
  commonName: string;
  disease: DiseaseDetection;
  confidence: number;
  severity: Severity;
  health: PlantHealth;
  symptoms: string[];
  treatments: Treatment[];
  prevention: string[];
  carePlan: CarePlanItem[];
  analyzedAt: string;
}
