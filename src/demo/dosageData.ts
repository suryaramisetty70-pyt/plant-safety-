import type {
  ChemicalOption,
  DosageCalculation,
  DosageRequest
} from "@/types/dosage";

export const CHEMICALS: ChemicalOption[] = [
  {
    id: "mancozeb",
    name: "Mancozeb",
    ratePerHectare: 2000,
    chemicalUnit: "g",
    waterLitersPerHectare: 500,
    applicationRate: "2 kg / hectare"
  },
  {
    id: "copper-oxychloride",
    name: "Copper Oxychloride",
    ratePerHectare: 2500,
    chemicalUnit: "g",
    waterLitersPerHectare: 500,
    applicationRate: "2.5 kg / hectare"
  },
  {
    id: "neem-oil",
    name: "Neem Oil",
    ratePerHectare: 2500,
    chemicalUnit: "ml",
    waterLitersPerHectare: 500,
    applicationRate: "2.5 L / hectare"
  },
  {
    id: "chlorothalonil",
    name: "Chlorothalonil",
    ratePerHectare: 1500,
    chemicalUnit: "g",
    waterLitersPerHectare: 500,
    applicationRate: "1.5 kg / hectare"
  }
];

const toHectares = (area: number, unit: DosageRequest["unit"]) => {
  if (unit === "acres") return area * 0.404686;
  if (unit === "squareMeters") return area / 10000;
  return area;
};

export function calculateDemoDosage(
  request: DosageRequest
): DosageCalculation {
  const chemical =
    CHEMICALS.find((item) => item.id === request.chemicalId) || CHEMICALS[0];

  const normalizedHectares = toHectares(request.area, request.unit);

  return {
    chemicalName: chemical.name,
    area: request.area,
    unit: request.unit,
    normalizedHectares,
    applicationRate: chemical.applicationRate,
    totalWaterLiters: Math.round(
      normalizedHectares * chemical.waterLitersPerHectare
    ),
    chemicalQuantity: Number(
      (normalizedHectares * chemical.ratePerHectare).toFixed(1)
    ),
    chemicalUnit: chemical.chemicalUnit,
    disclaimer:
      "Demo calculation only. Always follow approved local product labels, crop directions, PPE requirements, and advice from a qualified agricultural professional."
  };
}
