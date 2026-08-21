import React, { useRef, useState } from "react";
import { FolderOpen, Camera, Microscope, X, Bolt, PieChart } from "lucide-react";
import { SAMPLE_CROPS, type SampleCrop } from "@/demo/sampleCrops";
import { TRANSLATIONS } from "@/i18n/translations";
import { LeafCanvasOverlay } from "./LeafCanvasOverlay";
import type { Lesion } from "@/types/diagnosis";

interface UploadZoneProps {
  language: string;
  onImageSelected: (file: File | Blob, sampleId?: string) => void;
  onAnalyze: () => void;
  selectedPreview: string | null;
  onClearImage: () => void;
  isAnalyzing: boolean;
  lesions: Lesion[];
  healthScore: number | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  language,
  onImageSelected,
  onAnalyze,
  selectedPreview,
  onClearImage,
  isAnalyzing,
  lesions,
  healthScore
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleSampleClick = (sample: SampleCrop) => {
    fetch(sample.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        onImageSelected(blob, sample.id);
      })
      .catch(() => {
        // Fallback placeholder blob
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        canvas.toBlob((b) => {
          if (b) onImageSelected(b, sample.id);
        });
      });
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      alert("Unable to access device camera.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          onImageSelected(blob);
          stopCamera();
        }
      });
    }
  };

  return (
    <div className="bg-[#121a16]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-heading font-bold text-base flex items-center gap-2 text-white">
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <span>{t.uploadTitle}</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
            JPG, PNG, WEBP
          </span>
        </div>

        {/* Dropzone container */}
        <div className="relative border-2 border-dashed border-emerald-500/30 rounded-xl bg-black/30 min-h-[260px] flex items-center justify-center overflow-hidden transition hover:border-emerald-400">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!selectedPreview && !showCamera && (
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                <Camera className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-100 mb-1">
                {t.dragDrop}
              </h4>
              <p className="text-xs text-slate-400 mb-4">or select from your device</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{t.browse}</span>
                </button>

                <button
                  onClick={startCamera}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t.camera}</span>
                </button>
              </div>
            </div>
          )}

          {/* Camera Modal overlay inside preview */}
          {showCamera && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 bg-black/70 p-2">
                <button
                  onClick={capturePhoto}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-500 text-slate-950 rounded-lg"
                >
                  Snap Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-1.5 text-xs font-bold bg-slate-800 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Selected Preview & Bounding Canvas Overlay */}
          {selectedPreview && !showCamera && (
            <div className="relative w-full h-[260px] flex items-center justify-center">
              <img
                src={selectedPreview}
                alt="Uploaded Plant Leaf"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
              <LeafCanvasOverlay lesions={lesions} isScanning={isAnalyzing} />

              {/* Laser Scan Line Animation */}
              {isAnalyzing && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#2ecc71] animate-pulse" />
              )}

              <button
                onClick={onClearImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 text-white flex items-center justify-center hover:bg-rose-600 transition z-20"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Damage Health Bar */}
        {healthScore !== null && (
          <div className="mt-3 bg-black/40 border border-emerald-500/20 rounded-lg p-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                Leaf Tissue Health:
              </span>
              <span className="font-bold text-emerald-400">
                {healthScore}% Healthy | {100 - healthScore}% Damage
              </span>
            </div>
            <div className="w-full h-2 bg-rose-950/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="mt-4 w-full py-3 px-4 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-[0_0_25px_rgba(46,204,113,0.35)] hover:from-emerald-400 hover:to-emerald-500 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Microscope className="w-4 h-4" />
          <span>{isAnalyzing ? "Scanning Leaf Cellular Structures..." : t.analyzeBtn}</span>
        </button>
      </div>

      {/* Quick Sample Crop Chips */}
      <div className="mt-5 pt-3 border-t border-slate-800">
        <span className="text-xs text-slate-400 flex items-center gap-1 mb-2 font-medium">
          <Bolt className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.testSamples}</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_CROPS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200 hover:border-emerald-400 hover:bg-emerald-500/10 transition flex items-center gap-1"
            >
              <span>{sample.icon}</span>
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
