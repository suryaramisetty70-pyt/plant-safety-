import type { PlantDiagnosis } from "@/types/diagnosis";

export const DEMO_DIAGNOSES: Record<string, PlantDiagnosis> = {
  tomato_blight: {
    id: "diag-tomato-1",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?q=80&w=800&auto=format&fit=crop",
    plantName: "Tomato Crop",
    scientificName: "Solanum lycopersicum",
    commonName: "Garden Tomato",
    disease: {
      id: "dis-1",
      name: "Early Blight (Alternaria solani)",
      scientificName: "Alternaria solani",
      confidence: 0.97,
      severity: "moderate",
      symptoms: [
        "Concentric target-like dark brown spots on lower leaves",
        "Chlorotic yellow halos surrounding necrotic spot lesions",
        "Lower leaf yellowing and premature leaf drop"
      ],
      lesions: [
        {
          id: "lesion-1",
          label: "Early Blight Target Spot",
          confidence: 0.96,
          severity: "moderate",
          boundingBox: { x: 32, y: 28, width: 22, height: 20 },
          areaPercentage: 14,
          color: "#e74c3c"
        },
        {
          id: "lesion-2",
          label: "Chlorotic Yellowing Halo",
          confidence: 0.94,
          severity: "mild",
          boundingBox: { x: 55, y: 48, width: 28, height: 26 },
          areaPercentage: 12,
          color: "#e67e22"
        }
      ]
    },
    confidence: 0.97,
    severity: "moderate",
    health: {
      healthScore: 74,
      healthyTissuePercentage: 74,
      lesionDamagePercentage: 26,
      diseaseSeverity: 45,
      infectionAreaPercentage: 26,
      detectionCount: 2
    },
    symptoms: [
      "Concentric target-like dark brown spots on lower leaves",
      "Chlorotic yellow halos surrounding necrotic spot lesions",
      "Lower leaf yellowing and premature leaf drop"
    ],
    treatments: [
      {
        id: "treat-1",
        category: "immediate",
        title: "Prune & Isolate Lower Foliage",
        description: "Immediately remove infected lower leaves to stop fungal spore splash.",
        steps: [
          "Prune leaves within 30cm of soil using sanitized shears.",
          "Dispose of infected foliage in sealed trash bags (do not compost).",
          "Avoid sprinkler watering; water base only."
        ]
      },
      {
        id: "treat-2",
        category: "organic",
        title: "Neem Oil & Copper Soap Spray",
        description: "Apply eco-friendly biological fungicides early morning.",
        steps: [
          "Mix 5ml Neem Oil + 1ml liquid soap per Liter of water.",
          "Spray thoroughly on upper and lower leaf surfaces every 7 days.",
          "Apply organic straw mulch around plant base."
        ]
      },
      {
        id: "treat-3",
        category: "chemical",
        title: "Mancozeb or Chlorothalonil Fungicide",
        description: "Targeted synthetic broad-spectrum protective fungicide.",
        steps: [
          "Mix 2g Mancozeb per Liter of spray water.",
          "Apply spray evenly early morning before rain."
        ],
        ppeRequired: ["Gloves", "Eye Goggles", "Mask"],
        beeProtection: "Spray at dusk when bees are not actively foraging.",
        preHarvestInterval: "7 Days Pre-Harvest Wait"
      },
      {
        id: "treat-4",
        category: "prevention",
        title: "Crop Rotation & Spacing",
        description: "Long-term preventative agronomy practices.",
        steps: [
          "Maintain 60cm row spacing between plants for sunlight and air flow.",
          "Rotate crops every 3 years with non-solanaceous crops."
        ]
      }
    ],
    prevention: [
      "Maintain 60cm row spacing for sunlight.",
      "Practice 3-year crop rotation."
    ],
    carePlan: [
      { day: 1, title: "Prune & Isolate", description: "Cut affected lower leaves.", status: "completed" },
      { day: 3, title: "Fungicide Spray", description: "Apply Neem or Mancozeb spray.", status: "pending" },
      { day: 5, title: "Mulch & Base Water", description: "Apply straw mulch around stem.", status: "pending" },
      { day: 7, title: "Re-inspection", description: "Check new upper shoots for spots.", status: "pending" }
    ],
    analyzedAt: new Date().toISOString()
  },
  corn_healthy: {
    id: "diag-corn-1",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop",
    plantName: "Corn / Maize Crop",
    scientificName: "Zea mays",
    commonName: "Field Corn",
    disease: {
      id: "dis-2",
      name: "Healthy Maize Crop",
      scientificName: "Zea mays",
      confidence: 0.99,
      severity: "healthy",
      symptoms: ["Vibrant green foliage with zero rust or blight lesions"],
      lesions: []
    },
    confidence: 0.99,
    severity: "healthy",
    health: {
      healthScore: 98,
      healthyTissuePercentage: 98,
      lesionDamagePercentage: 2,
      diseaseSeverity: 0,
      infectionAreaPercentage: 0,
      detectionCount: 0
    },
    symptoms: ["Vibrant green leaf blades with sturdy vascular structure."],
    treatments: [
      {
        id: "treat-corn-1",
        category: "immediate",
        title: "Maintain Fertigation Schedule",
        description: "No disease control action needed.",
        steps: ["Continue standard irrigation regimen."]
      }
    ],
    prevention: ["Monitor for Fall Armyworm caterpillars during humid weather."],
    carePlan: [
      { day: 1, title: "Fertilizer Boost", description: "Apply organic nitrogen fertilizer.", status: "completed" }
    ],
    analyzedAt: new Date().toISOString()
  }
};

export function getDemoDiagnosis(sampleId?: string, image?: File | Blob): PlantDiagnosis {
  if (sampleId && DEMO_DIAGNOSES[sampleId]) {
    return DEMO_DIAGNOSES[sampleId];
  }
  return DEMO_DIAGNOSES.tomato_blight;
}
