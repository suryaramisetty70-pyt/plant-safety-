export type NutrientCode = "N" | "P" | "K" | "Ca" | "Fe";

export interface NutrientDiagnosis {
  nutrient: NutrientCode;
  nutrientName: string;
  likelihood: number;
  symptom: string;
  description: string;
  recommendedAction: string[];
  urgency: "low" | "medium" | "high";
}
