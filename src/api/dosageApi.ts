import { apiRequest, isDemoMode } from "./plantDoctorApi";
import type { DosageCalculation, DosageRequest } from "@/types/dosage";
import { calculateDemoDosage } from "@/demo/dosageData";

export async function calculateDosage(
  request: DosageRequest
): Promise<DosageCalculation> {
  if (isDemoMode()) {
    return calculateDemoDosage(request);
  }

  return apiRequest<DosageCalculation>("/api/dosage", {
    method: "POST",
    body: JSON.stringify(request)
  });
}
