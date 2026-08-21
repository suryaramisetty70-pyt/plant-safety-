import type { NutrientDiagnosis, NutrientCode } from "@/types/soil";

export function getDemoSoilDiagnosis(crop: string, symptom: string): NutrientDiagnosis {
  const code = (symptom.toUpperCase() as NutrientCode) || "N";

  if (code === "N" || symptom.includes("yellow_lower")) {
    return {
      nutrient: "N",
      nutrientName: "Nitrogen (N) Deficiency",
      likelihood: 0.92,
      symptom: "Lower leaf uniform chlorotic yellowing",
      description: "Nitrogen is mobile in plants, so deficiency symptoms appear first on older lower leaves.",
      recommendedAction: [
        "Apply Urea (46% N) at 5g/L water foliar spray or soil application.",
        "Apply well-rotted vermicompost tea at crop root base."
      ],
      urgency: "high"
    };
  }

  if (code === "P" || symptom.includes("purple")) {
    return {
      nutrient: "P",
      nutrientName: "Phosphorus (P) Deficiency",
      likelihood: 0.88,
      symptom: "Dark green leaves with purplish underside tint",
      description: "Phosphorus deficiency restricts root growth and delays maturity.",
      recommendedAction: [
        "Apply Single Super Phosphate (SSP) or bone meal.",
        "Ensure soil pH is balanced between 6.0 and 7.0."
      ],
      urgency: "medium"
    };
  }

  if (code === "K" || symptom.includes("burnt")) {
    return {
      nutrient: "K",
      nutrientName: "Potassium (K) Deficiency",
      likelihood: 0.9,
      symptom: "Burnt, scorched leaf margins and brown tips",
      description: "Potassium regulates leaf stomata transpiration and disease resistance.",
      recommendedAction: [
        "Apply Muriate of Potash (MOP) or wood ash water extract.",
        "Improve soil potassium fertigation."
      ],
      urgency: "high"
    };
  }

  return {
    nutrient: "Ca",
    nutrientName: "Calcium (Ca) Deficiency",
    likelihood: 0.85,
    symptom: "Blossom end rot on bottom of tomato fruit",
    description: "Calcium deficiency causes cell wall collapse at fast-growing fruit tips.",
    recommendedAction: [
      "Foliar spray Calcium Nitrate (2g/L water).",
      "Maintain consistent soil moisture levels."
    ],
    urgency: "medium"
  };
}
