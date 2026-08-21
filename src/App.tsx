import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { UploadZone } from "./components/UploadZone";
import { DiagnosisResults } from "./components/DiagnosisResults";
import { ChatbotDrawer } from "./components/ChatbotDrawer";
import { SoilWizardModal } from "./components/SoilWizardModal";
import { DosageModal } from "./components/DosageModal";
import { HistoryModal } from "./components/HistoryModal";
import { CarePlanModal } from "./components/CarePlanModal";
import { ApiModal } from "./components/ApiModal";

import { analyzePlantImage } from "./api/diagnosisApi";
import { getBotanicalInformation } from "./api/wikipediaApi";
import type { PlantDiagnosis } from "./types/diagnosis";
import type { BotanicalInformation, ScanHistory } from "./types/plant";

export function App() {
  const [language, setLanguage] = useState("en");
  const [selectedImage, setSelectedImage] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sampleId, setSampleId] = useState<string | undefined>(undefined);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [botanicalInfo, setBotanicalInfo] = useState<BotanicalInformation | null>(null);
  const [loadingWiki, setLoadingWiki] = useState(false);

  const [history, setHistory] = useState<ScanHistory[]>([]);

  // Modals state
  const [isSoilOpen, setIsSoilOpen] = useState(false);
  const [isDosageOpen, setIsDosageOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCarePlanOpen, setIsCarePlanOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const handleImageSelected = (file: File | Blob, sid?: string) => {
    setSelectedImage(file);
    setSampleId(sid);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setSampleId(undefined);
    setDiagnosis(null);
    setBotanicalInfo(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert("Please upload or select a leaf photo first.");
      return;
    }

    setIsAnalyzing(true);
    setLoadingWiki(true);

    try {
      const diag = await analyzePlantImage(selectedImage, sampleId);
      setDiagnosis(diag);

      // Save to history
      const histItem: ScanHistory = {
        id: `hist-${Date.now()}`,
        thumbnail: previewUrl || "",
        crop: diag.plantName,
        disease: diag.disease.name,
        confidence: Math.round(diag.confidence * 100),
        severity: diag.severity,
        healthScore: diag.health.healthScore,
        scannedAt: new Date().toLocaleDateString()
      };
      setHistory((prev) => [histItem, ...prev]);

      // Fetch live Wikipedia
      const wiki = await getBotanicalInformation(diag.scientificName || diag.plantName);
      setBotanicalInfo(wiki);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setLoadingWiki(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Animated Globes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-600/15 blur-[140px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Header
          language={language}
          onLanguageChange={setLanguage}
          onOpenSoilWizard={() => setIsSoilOpen(true)}
          onOpenDosageCalc={() => setIsDosageOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenApiModal={() => setIsApiModalOpen(true)}
          historyCount={history.length}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Hero language={language} />

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
            <div className="lg:col-span-5">
              <UploadZone
                language={language}
                onImageSelected={handleImageSelected}
                onAnalyze={handleAnalyze}
                selectedPreview={previewUrl}
                onClearImage={handleClearImage}
                isAnalyzing={isAnalyzing}
                lesions={diagnosis?.disease.lesions || []}
                healthScore={diagnosis ? diagnosis.health.healthScore : null}
              />
            </div>

            <div className="lg:col-span-7">
              <DiagnosisResults
                diagnosis={diagnosis}
                botanicalInfo={botanicalInfo}
                loadingWiki={loadingWiki}
                language={language}
                onOpenCarePlan={() => setIsCarePlanOpen(true)}
              />
            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-emerald-500/20 py-4 text-center text-xs text-slate-500">
          © 2026 PlantDoctor.AI — Free AI Agronomy & Plant Diagnostics.
        </footer>
      </div>

      {/* Floating Assistant & Modals */}
      <ChatbotDrawer language={language} plantContext={diagnosis?.plantName} />

      <SoilWizardModal isOpen={isSoilOpen} onClose={() => setIsSoilOpen(false)} />
      <DosageModal isOpen={isDosageOpen} onClose={() => setIsDosageOpen(false)} />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />
      <CarePlanModal
        isOpen={isCarePlanOpen}
        onClose={() => setIsCarePlanOpen(false)}
        carePlan={diagnosis?.carePlan || []}
      />
      <ApiModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </div>
  );
}

export default App;
