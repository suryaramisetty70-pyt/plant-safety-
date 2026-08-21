export type AreaUnit = "acres" | "hectares" | "squareMeters";

export interface DosageRequest {
  area: number;
  unit: AreaUnit;
  chemicalId: string;
}

export interface DosageCalculation {
  chemicalName: string;
  area: number;
  unit: AreaUnit;
  normalizedHectares: number;
  applicationRate: string;
  totalWaterLiters: number;
  chemicalQuantity: number;
  chemicalUnit: "g" | "ml";
  disclaimer: string;
}

export interface ChemicalOption {
  id: string;
  name: string;
  ratePerHectare: number;
  chemicalUnit: "g" | "ml";
  waterLitersPerHectare: number;
  applicationRate: string;
}
