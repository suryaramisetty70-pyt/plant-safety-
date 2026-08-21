import { apiRequest, isDemoMode } from "./plantDoctorApi";
import type { NutrientDiagnosis } from "@/types/soil";
import { getDemoSoilDiagnosis } from "@/demo/soilData";

export async function analyzeSoilSymptom(
  crop: string,
  symptom: string
): Promise<NutrientDiagnosis> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return getDemoSoilDiagnosis(crop, symptom);
  }

  return apiRequest<NutrientDiagnosis>("/api/soil-diagnosis", {
    method: "POST",
    body: JSON.stringify({ crop, symptom })
  });
}
