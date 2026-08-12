# PlantDoctor.AI 🌿 — Free AI Crop & Disease Diagnostic Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Stack: HTML/CSS/JS](https://img.shields.io/badge/Stack-Vanilla_JS_--_HTML5_--_CSS3-blue)](https://developer.mozilla.org/)
[![AI: Gemini Vision](https://img.shields.io/badge/AI_Engine-Google_Gemini_Vision_API-emerald)](https://aistudio.google.com/)

**PlantDoctor AI** is a 100% free, intelligent web platform designed to assist farmers, agronomists, and plant enthusiasts in identifying crop species, diagnosing plant diseases or leaf injuries, and obtaining actionable organic & chemical treatment remedies in real time.

---

## 🌟 Key Features

- 🌿 **Crop & Species Identification**: Automatically identifies plant species (e.g. Tomato, Corn, Apple, Grape, Rice, Wheat, Pepper, Potato) and botanical names.
- 🔬 **Disease & Pest Diagnosis**: Detects fungal spores, bacterial lesions, viral mosaics, sap-sucking pests, and nutrient chlorosis.
- 📖 **Wikipedia Botanical Knowledge Base**: Connects to the official Wikipedia REST API to fetch live botanical descriptions, taxonomy, and habitat facts for each scanned plant.
- 🌐 **Native Multi-Lingual Agronomy**: Complete localized UI and diagnostic reports in **English, Telugu (తెలుగు), Hindi (हिंदी), Tamil (தமிழ்), and Spanish (Español)**.
- 🧮 **Farm Area Dosage Calculator**: Calculates required water spray volume (Liters) and exact chemical weights (Grams/mL) based on farm size in Acres, Hectares, or Sq. Meters.
- 📜 **Scan History Log**: Stores past plant diagnoses in browser memory with timestamps and health badges.
- 🌦️ **Agri-Weather Risk Advisor**: Real-time fungal spore risk advisor giving protective spray recommendations before rain.
- 🔊 **Voice Audio Read-Aloud (TTS)**: Spoken remedy narration for accessibility in farm environments.
- 🖨️ **Printable Report Export**: Export clean agronomist diagnostic reports to PDF or paper.

---

## 📁 Repository Structure

```
plant-doctor-ai/
├── index.html            # Main HTML markup & glassmorphic dashboard layout
├── styles.css            # Custom CSS3 design system, dark mode, laser scanner animations
├── app.js                # Application logic, Gemini API & Wikipedia integration, multilingual engine
└── README.md             # Project documentation & setup guide
```

---

## 🚀 How to Run Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/suryaramisetty70-pyt/plant-safety-.git
   cd plant-safety-
   ```

2. Serve the static files using any local web server (e.g. Python):
   ```bash
   python -m http.server 9090
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:9090
   ```

---

## 🔑 API Key Configuration (Optional)

PlantDoctor AI works out of the box with a built-in **Smart Agricultural Vision Analyzer**. To connect to Google's Gemini Vision API directly:
1. Get a free API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Click **API Settings** in the top navigation bar of the web app.
3. Paste your API key and click **Save Key & Connect**.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
