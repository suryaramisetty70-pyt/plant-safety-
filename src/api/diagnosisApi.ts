import { apiRequest, isDemoMode } from "./plantDoctorApi";
import type { PlantDiagnosis } from "@/types/diagnosis";
import { getDemoDiagnosis } from "@/demo/diagnosisData";

export async function analyzePlantImage(
  image: File | Blob,
  sampleId?: string
): Promise<PlantDiagnosis> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    return getDemoDiagnosis(sampleId, image);
  }

  const formData = new FormData();
  formData.append("image", image);

  return apiRequest<PlantDiagnosis>("/api/analyze", {
    method: "POST",
    body: formData
  });
}
