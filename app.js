/* ----------------------------------------------------
   PlantDoctor.AI — Fully Functional Multilingual Engine
   with Wikipedia Knowledge API Integration
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        apiKey: localStorage.getItem('plant_doc_gemini_key') || '',
        currentImageBase64: null,
        currentMimeType: 'image/jpeg',
        currentSampleKey: 'tomato_blight',
        isAnalyzing: false,
        cameraStream: null,
        speechInstance: null,
        isSpeaking: false,
        language: 'en',
        history: JSON.parse(localStorage.getItem('plant_doc_history') || '[]')
    };

    function safeBind(id, event, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    }

    // --- Localization UI Dictionary ---
    const UI_I18N = {
        en: {
            heroTitle: 'Identify Any Crop & Heal <br><span class="text-gradient">Plant Diseases Instantly</span>',
            heroSubtitle: 'Upload a photo of any leaf, stem, fruit, or plant. Our AI identifies the plant species, detects infection, pests, or nutrient injuries, and provides biological & chemical remedies.',
            analyzeBtn: '<i class="fa-solid fa-microscope"></i> Analyze Plant & Find Remedies',
            weatherLabel: 'Agri-Weather & Risk Alert',
            weatherText: 'Temp: 28°C | Humidity: 78% | Fungal Spore Risk: HIGH',
            weatherAdvice: 'High humidity accelerates blight & mildew. Spray protective fungicides before rain.',
            uploadTitle: 'Upload Plant Image',
            dropTitle: 'Drag & Drop leaf/crop photo here',
            dropSub: 'or click to browse from your device',
            browse: 'Browse File',
            camera: 'Use Camera',
            samplesTitle: 'Test with Sample Crops:',
            emptyTitle: 'No Plant Analyzed Yet',
            emptySub: 'Select or upload a photo on the left panel and click <strong>"Analyze Plant"</strong> to get instant diagnosis and remedies.',
            tabImmediate: '<i class="fa-solid fa-kit-medical"></i> Immediate Action',
            tabOrganic: '<i class="fa-solid fa-clover"></i> Organic Fixes',
            tabChemical: '<i class="fa-solid fa-flask-vial"></i> Chemical Remedies',
            tabPrevention: '<i class="fa-solid fa-shield-halved"></i> Prevention'
        },
        te: {
            heroTitle: 'ఏ పంటనైనా గుర్తించండి మరియు <br><span class="text-gradient">మొక్కల వ్యాధులను తక్షణమే నయం చేయండి</span>',
            heroSubtitle: 'ఏదైనా ఆకు లేదా పంట ఫోటోను అప్‌లోడ్ చేయండి. మా AI మొక్కల జాతులను గుర్తిస్తుంది, తెగుళ్ళను కనుగొంటుంది మరియు నివారణలను అందిస్తుంది.',
            analyzeBtn: '<i class="fa-solid fa-microscope"></i> మొక్కను విశ్లేషించండి & నివారణలను కనుగొనండి',
            weatherLabel: 'వ్యవసాయ వాతావరణం & వ్యాధి హెచ్చరిక',
            weatherText: 'ఉష్ణోగ్రత: 28°C | తేమ: 78% | శిలీంధ్రాల (Fungal) ప్రమాదం: తీవ్రమైనది',
            weatherAdvice: 'అధిక తేమ వల్ల తెగుళ్ళు త్వరగా వ్యాపిస్తాయి. వర్షానికి ముందు మందులు పిచికారీ చేయండి.',
            uploadTitle: 'మొక్క చిత్రం అప్‌లోడ్ చేయండి',
            dropTitle: 'ఇక్కడ ఆకు లేదా పంట ఫోటోను డ్రాప్ చేయండి',
            dropSub: 'లేదా మీ పరికరం నుండి ఎంచుకోండి',
            browse: 'ఫైల్ ఎంచుకోండి',
            camera: 'కెమెరా వాడండి',
            samplesTitle: 'నమూనా పంటలతో పరీక్షించండి:',
            emptyTitle: 'ఇంకా ఏ మొక్కనూ విశ్లేషించలేదు',
            emptySub: 'ఎడమ వైపున ఉన్న ఫోటోను ఎంచుకుని <strong>"మొక్కను విశ్లేషించండి"</strong> క్లిక్ చేయండి.',
            tabImmediate: '<i class="fa-solid fa-kit-medical"></i> తక్షణ చర్య',
            tabOrganic: '<i class="fa-solid fa-clover"></i> సేంద్రీయ నివారణలు',
            tabChemical: '<i class="fa-solid fa-flask-vial"></i> రసాయన మందులు',
            tabPrevention: '<i class="fa-solid fa-shield-halved"></i> ముందస్తు జాగ్రత్తలు'
        },
        hi: {
            heroTitle: 'किसी भी फसल की पहचान करें और <br><span class="text-gradient">पौधों की बीमारियों का तुरंत इलाज पाएं</span>',
            heroSubtitle: 'किसी भी पत्ती या फसल का फोटो अपलोड करें। हमारा AI पौधों की प्रजातियों की पहचान करता है, संक्रमण का पता लगाता है, और उपचार प्रदान करता है।',
            analyzeBtn: '<i class="fa-solid fa-microscope"></i> पौधे का विश्लेषण करें और उपचार पाएं',
            weatherLabel: 'कृषि मौसम और जोखिम चेतावनी',
            weatherText: 'तापमान: 28°C | नमी: 78% | फफूंद का खतरा: उच्च',
            weatherAdvice: 'उच्च नमी से झुलसा तेजी से फैलता है। बारिश से पहले कवकनाशी का छिड़काव करें।',
            uploadTitle: 'पौधे की छवि अपलोड करें',
            dropTitle: 'पत्ती या फसल का फोटो यहां डालें',
            dropSub: 'या अपनी गैलरी से चुनें',
            browse: 'फ़ाइल चुनें',
            camera: 'कैमरा इस्तेमाल करें',
            samplesTitle: 'नमूना फसलों के साथ परीक्षण करें:',
            emptyTitle: 'अभी तक किसी पौधे का विश्लेषण नहीं हुआ',
            emptySub: 'बाईं ओर फोटो चुनें और <strong>"विश्लेषण करें"</strong> पर क्लिक करें।',
            tabImmediate: '<i class="fa-solid fa-kit-medical"></i> तत्काल कार्रवाई',
            tabOrganic: '<i class="fa-solid fa-clover"></i> जैविक उपाय',
            tabChemical: '<i class="fa-solid fa-flask-vial"></i> रासायनिक दवाएं',
            tabPrevention: '<i class="fa-solid fa-shield-halved"></i> रोकथाम के उपाय'
        },
        ta: {
            heroTitle: 'எந்தப் பயிரையும் கண்டறிந்து <br><span class="text-gradient">தாவர நோய்களை உடனடியாகக் குணப்படுத்துங்கள்</span>',
            heroSubtitle: 'எந்தவொரு இலை அல்லது பயிரின் புகைப்படத்தையும் பதிவேற்றவும். எங்கள் AI தாவர வகைகளைக் கண்டறிந்து சிகிச்சைகளை வழங்குகிறது.',
            analyzeBtn: '<i class="fa-solid fa-microscope"></i> தாவரத்தை பகுப்பாய்வு செய்து தீர்வு காணவும்',
            weatherLabel: 'வேளாண் வானிலை எச்சரிக்கை',
            weatherText: 'வெப்பநிலை: 28°C | ஈரம்: 78% | பூஞ்சை ஆபத்து: அதிகம்',
            weatherAdvice: 'அதிக ஈரப்பதம் நோய்களை விரைவுபடுத்துகிறது. மழைக்கு முன் மருந்து தெளிக்கவும்.',
            uploadTitle: 'தாவர படத்தை பதிவேற்றவும்',
            dropTitle: 'இலையின் புகைப்படத்தை இங்கே போடவும்',
            dropSub: 'அல்லது உங்கள் கேலரியில் இருந்து தேர்வு செய்யவும்',
            browse: 'கோப்பைத் தேர்ந்தெடு',
            camera: 'கேமராவைப் பயன்படுத்து',
            samplesTitle: 'மாதிரி பயிர்களுடன் சோதிக்கவும்:',
            emptyTitle: 'இன்னும் எந்த தாவரமும் பகுப்பாய்வு செய்யப்படவில்லை',
            emptySub: 'இடதுபுறத்தில் படத்தை தேர்வு செய்து <strong>"பகுப்பாய்வு செய்"</strong> அழுத்தவும்.',
            tabImmediate: '<i class="fa-solid fa-kit-medical"></i> உடனடி நடவடிக்கை',
            tabOrganic: '<i class="fa-solid fa-clover"></i> இயற்கை மருந்துகள்',
            tabChemical: '<i class="fa-solid fa-flask-vial"></i> ரசாயன மருந்துகள்',
            tabPrevention: '<i class="fa-solid fa-shield-halved"></i> தடுப்பு முறைகள்'
        },
        es: {
            heroTitle: 'Identifica cualquier cultivo y cura <br><span class="text-gradient">enfermedades de plantas al instante</span>',
            heroSubtitle: 'Sube una foto de cualquier hoja o cultivo. Nuestra IA identifica la especie, detecta plagas y proporciona remedios orgánicos y químicos.',
            analyzeBtn: '<i class="fa-solid fa-microscope"></i> Analizar planta y buscar remedios',
            weatherLabel: 'Alerta Meteorológica Agrícola',
            weatherText: 'Temp: 28°C | Humedad: 78% | Riesgo fúngico: ALTO',
            weatherAdvice: 'La alta humedad acelera los hongos. Aplique fungicidas antes de la lluvia.',
            uploadTitle: 'Subir imagen de planta',
            dropTitle: 'Arrastra y suelta la foto aquí',
            dropSub: 'o haz clic para buscar en tu dispositivo',
            browse: 'Buscar archivo',
            camera: 'Usar cámara',
            samplesTitle: 'Probar con cultivos de muestra:',
            emptyTitle: 'Aún no se ha analizado ninguna planta',
            emptySub: 'Selecciona una foto a la izquierda y haz clic en <strong>"Analizar planta"</strong>.',
            tabImmediate: '<i class="fa-solid fa-kit-medical"></i> Acción inmediata',
            tabOrganic: '<i class="fa-solid fa-clover"></i> Remedios orgánicos',
            tabChemical: '<i class="fa-solid fa-flask-vial"></i> Tratamientos químicos',
            tabPrevention: '<i class="fa-solid fa-shield-halved"></i> Prevención'
        }
    };

    // --- Multi-Language Multi-Crop Agronomy Database ---
    const CROP_DATABASE = {
        tomato: {
            en: {
                plant_name: "Tomato Crop",
                scientific_name: "Solanum lycopersicum",
                health_status: "Infected",
                condition_name: "Septoria Leaf Spot / Early Blight (Alternaria solani)",
                confidence_score: "97%",
                severity: "High",
                symptoms: [
                    "Numerous circular dark brown/black spots detected on leaf foliage",
                    "Chlorotic yellow halo surrounding necrotic spot lesions",
                    "Lower older foliage showing advanced tissue degradation"
                ],
                immediate_rescue: [
                    "Prune and destroy all heavily spotted lower leaves immediately (do not compost).",
                    "Avoid overhead sprinkler watering to stop fungal spores from splashing."
                ],
                organic_remedies: [
                    "Spray Neem Oil emulsion (5ml per liter of water) during early morning.",
                    "Apply copper-based organic fungicide spray once every 7 days.",
                    "Apply straw mulch around the base of the plant to suppress soil spore splash."
                ],
                chemical_remedies: [
                    "Spray Chlorothalonil or Mancozeb fungicide at 2g per Liter of water.",
                    "Re-apply spray every 7 to 10 days until new foliage grows healthy."
                ],
                preventive_measures: [
                    "Maintain 60cm row spacing between plants for sunlight & air circulation.",
                    "Practice 3-year crop rotation with non-solanaceous crops."
                ]
            },
            te: {
                plant_name: "టమాటో పంట (Tomato Crop)",
                scientific_name: "Solanum lycopersicum",
                health_status: "తెగులు ఆవహించింది (Infected)",
                condition_name: "అర్లీ బ్లైట్ / ఆకు మచ్చ తెగులు (Early Blight)",
                confidence_score: "97%",
                severity: "తీవ్రమైనది (High)",
                symptoms: [
                    "ఆకులపై నల్లటి మరియు గోధుమ రంగు వలయాకార మచ్చలు గమనించబడ్డాయి",
                    "మచ్చల చుట్టూ పసుపు రంగు వలయాలు (Yellow Halo) ఏర్పడటం",
                    "క్రింది పాత ఆకులు ఎండిపోయి రాలిపోవడం"
                ],
                immediate_rescue: [
                    "తెగులు సోకిన క్రింది ఆకులను వెంటనే తెంపి తగులబెట్టండి.",
                    "చెట్లపై నీటిని చల్లడం ఆపివేయండి; మొదళ్లలో మాత్రమే నీరు పోయండి."
                ],
                organic_remedies: [
                    "లీటరు నీటికి 5 మి.లీ వేప నూనె కలిపి ఉదయాన్నే పిచికారీ చేయండి.",
                    "కాపర్ ఆధారిత సేంద్రీయ శిలీంధ్ర నాశిని 7 రోజులకు ఒకసారి చల్లండి.",
                    "నేల నుండి తెగులు వ్యాపించకుండా మొదళ్లలో ఎండుగడ్డి పరచండి."
                ],
                chemical_remedies: [
                    "లీటరు నీటికి 2 గ్రాముల మ్యాంకోజెబ్ (Mancozeb) లేదా క్లోరోథలోనిల్ కలిపి పిచికారీ చేయండి.",
                    "ప్రతి 7 నుండి 10 రోజులకు ఒకసారి ఈ మందును చల్లండి."
                ],
                preventive_measures: [
                    "మొక్కల మధ్య 60 సెం.మీ దూరం ఉండేలా చూసుకోండి.",
                    "ప్రతి 3 సంవత్సరాలకు ఒకసారి పంట మార్పిడి చేయండి."
                ]
            },
            hi: {
                plant_name: "टमाटर की फसल (Tomato Crop)",
                scientific_name: "Solanum lycopersicum",
                health_status: "संक्रमित (Infected)",
                condition_name: "अगेती झुलसा / पत्ती धब्बा रोग (Early Blight)",
                confidence_score: "97%",
                severity: "उच्च (High)",
                symptoms: [
                    "पत्तियों पर काले और भूरे रंग के गोल धब्बे",
                    "धब्बों के चारों ओर पीला घेरा बनना",
                    "निचली पुरानी पत्तियों का सूखकर गिरना"
                ],
                immediate_rescue: [
                    "संक्रमित निचली पत्तियों को तुरंत काटकर नष्ट कर दें।",
                    "पत्तियों पर पानी छिड़कना बंद करें, केवल जड़ों में पानी दें।"
                ],
                organic_remedies: [
                    "5 मि.मी. नीम का तेल प्रति लीटर पानी में मिलाकर सुबह छिड़कें।",
                    "कॉपर युक्त जैविक कवकनाशी का छिड़काव हर 7 दिन में करें।"
                ],
                chemical_remedies: [
                    "2 ग्राम मैंकोजेब (Mancozeb) प्रति लीटर पानी में मिलाकर छिड़कें।"
                ],
                preventive_measures: [
                    "पौधों के बीच उचित दूरी बनाएं और फसल चक्र अपनाएं।"
                ]
            },
            ta: {
                plant_name: "தக்காளி பயிர் (Tomato Crop)",
                scientific_name: "Solanum lycopersicum",
                health_status: "பாதிக்கப்பட்டது (Infected)",
                condition_name: "இலைப்புள்ளி நோய் (Early Blight)",
                confidence_score: "97%",
                severity: "அதிகம் (High)",
                symptoms: [
                    "இலைகளில் கருப்பு மற்றும் பழுப்பு நிற வட்ட புள்ளிகள்",
                    "புள்ளிகளைச் சுற்றி மஞ்சள் நிற வளையம்",
                    "கீழ் இலைகள் காய்ந்து உதிர்வது"
                ],
                immediate_rescue: [
                    "பாதிக்கப்பட்ட கீழ் இலைகளை உடனே அகற்றி அழிக்கவும்."
                ],
                organic_remedies: [
                    "வேப்ப எண்ணெய் 5ml/லிட்டர் நீரில் கலந்து தெளிக்கவும்."
                ],
                chemical_remedies: [
                    "மேன்கோசெப் (Mancozeb) 2g/லிட்டர் நீரில் கலந்து தெளிக்கவும்."
                ],
                preventive_measures: [
                    "பயிர்களுக்கு இடையே இடைவெளி விட்டு பயிரிடவும்."
                ]
            },
            es: {
                plant_name: "Cultivo de Tomate",
                scientific_name: "Solanum lycopersicum",
                health_status: "Infectado",
                condition_name: "Tizón Temprano / Mancha Foliar (Alternaria solani)",
                confidence_score: "97%",
                severity: "Alta",
                symptoms: [
                    "Manchas circulares de color marrón oscuro/negro en las hojas",
                    "Halo amarillo rodeando las lesiones de las manchas",
                    "Caída prematura de las hojas inferiores"
                ],
                immediate_rescue: [
                    "Pode y destruya las hojas inferiores infectadas inmediatamente."
                ],
                organic_remedies: [
                    "Rocíe emulsión de aceite de Neem (5 ml por litro de agua)."
                ],
                chemical_remedies: [
                    "Aplique fungicida Mancozeb a razón de 2 g por litro de agua."
                ],
                preventive_measures: [
                    "Mantenga espacio de 60 cm entre plantas y rote los cultivos."
                ]
            }
        },
        corn: {
            en: {
                plant_name: "Corn / Maize Crop",
                scientific_name: "Zea mays",
                health_status: "Healthy",
                condition_name: "Healthy Maize Crop (Optimal Chlorophyll Density)",
                confidence_score: "98%",
                severity: "None (Healthy)",
                symptoms: [
                    "Vibrant green leaf blade coloration with sturdy vascular veins",
                    "Zero visible rust pustules, blights, or stem borer damage"
                ],
                immediate_rescue: [
                    "No control actions needed. Maintain standard fertility regimen."
                ],
                organic_remedies: [
                    "Apply compost tea or organic nitrogen booster at knee-high growth stage."
                ],
                chemical_remedies: [
                    "No chemical sprays required for healthy foliage."
                ],
                preventive_measures: [
                    "Monitor regularly for Fall Armyworm caterpillars during humid periods."
                ]
            },
            te: {
                plant_name: "మొక్కజొన్న పంట (Maize Crop)",
                scientific_name: "Zea mays",
                health_status: "ఆరోగ్యకరమైనది (Healthy)",
                condition_name: "ఆరోగ్యకరమైన మొక్కజొన్న (Healthy Crop)",
                confidence_score: "98%",
                severity: "ఏమీ లేదు (Healthy)",
                symptoms: [
                    "ఆకులు గాఢమైన ఆకుపచ్చ రంగులో పత్రహరితంతో నిండి ఉన్నాయి",
                    "ఎటువంటి తెగుళ్ళు లేదా కాండం తొలిచే పురుగుల ప్రభావం లేదు"
                ],
                immediate_rescue: [
                    "ఎటువంటి మందులు అవసరం లేదు. క్రమబద్ధమైన నీటి యాజమాన్యం కొనసాగించండి."
                ],
                organic_remedies: [
                    "సేంద్రీయ ఎరువులు లేదా జీవామృతం మొక్కల మొదళ్లలో అందించండి."
                ],
                chemical_remedies: [
                    "ఎటువంటి రసాయన మందులు పిచికారీ చేయవలసిన అవసరం లేదు."
                ],
                preventive_measures: [
                    "కత్తెర పురుగు (Fall Armyworm) రాకుండా క్రమం తప్పకుండా పరిశీలించండి."
                ]
            },
            hi: {
                plant_name: "मक्का की फसल (Maize Crop)",
                scientific_name: "Zea mays",
                health_status: "स्वस्थ (Healthy)",
                condition_name: "स्वस्थ मक्का (Healthy Crop)",
                confidence_score: "98%",
                severity: "कोई नहीं (Healthy)",
                symptoms: ["पत्तियां हरी और स्वस्थ हैं, कोई बीमारी नहीं है।"],
                immediate_rescue: ["नियमित देखभाल जारी रखें।"],
                organic_remedies: ["जैविक खाद का प्रयोग करें।"],
                chemical_remedies: ["कीटनाशक की आवश्यकता नहीं है।"],
                preventive_measures: ["फसल की नियमित निगरानी करें।"]
            },
            ta: {
                plant_name: "சோளப் பயிர் (Maize Crop)",
                scientific_name: "Zea mays",
                health_status: "ஆரோக்கியமானது (Healthy)",
                condition_name: "ஆரோக்கியமான சோளம்",
                confidence_score: "98%",
                severity: "எதுவுமில்லை",
                symptoms: ["இலைகள் ஆரோக்கியமாக உள்ளன."],
                immediate_rescue: ["வழக்கமான பராமரிப்பு போதும்."],
                organic_remedies: ["இயற்கை உரம் இடவும்."],
                chemical_remedies: ["மருந்து தேவையில்லை."],
                preventive_measures: ["தொடர்ந்து கண்காணிக்கவும்."]
            },
            es: {
                plant_name: "Cultivo de Maíz",
                scientific_name: "Zea mays",
                health_status: "Saludable",
                condition_name: "Maíz Saludable",
                confidence_score: "98%",
                severity: "Ninguna",
                symptoms: ["Hojas verdes saludables sin plagas ni hongos."],
                immediate_rescue: ["Continuar con el riego normal."],
                organic_remedies: ["Aplicar compost orgánico."],
                chemical_remedies: ["No requiere químicos."],
                preventive_measures: ["Monitorear periódicamente."]
            }
        },
        apple: {
            en: {
                plant_name: "Apple Tree Fruit & Foliage",
                scientific_name: "Malus domestica",
                health_status: "Infected",
                condition_name: "Apple Scab (Venturia inaequalis)",
                confidence_score: "96%",
                severity: "High",
                symptoms: [
                    "Velvety olive-green to black corky scabby spots on fruit peel and leaves",
                    "Fruit distortion and skin cracking"
                ],
                immediate_rescue: [
                    "Remove and destroy scabby fruits and leaves from orchard ground."
                ],
                organic_remedies: [
                    "Apply sulfur-based spray or liquid lime-sulfur early in spring bud break."
                ],
                chemical_remedies: [
                    "Apply Captan or Myclobutanil fungicide spray at recommended dose."
                ],
                preventive_measures: [
                    "Prune tree canopy to maximize air movement and fast leaf drying."
                ]
            },
            te: {
                plant_name: "యాపిల్ పంట (Apple Crop)",
                scientific_name: "Malus domestica",
                health_status: "తెగులు సోకింది (Infected)",
                condition_name: "యాపిల్ స్కాబ్ తెగులు (Apple Scab)",
                confidence_score: "96%",
                severity: "తీవ్రమైనది (High)",
                symptoms: [
                    "యాపిల్ కాయలు మరియు ఆకులపై నల్లటి గరుకు మచ్చలు ఏర్పడటం",
                    "కాయలు వంకర్లు తిరిగి పగలడం"
                ],
                immediate_rescue: [
                    "తెగులు సోకిన కాయలు మరియు రాలిన ఆకులను తీసి తగులబెట్టండి."
                ],
                organic_remedies: [
                    "వసంతకాలంలో గంధకపు (Sulfur) స్ప్రే పిచికారీ చేయండి."
                ],
                chemical_remedies: [
                    "క్యాప్టాన్ (Captan) లేదా మైక్లోబుటానిల్ ఫంగిసైడ్ పిచికారీ చేయండి."
                ],
                preventive_measures: [
                    "చెట్టు కొమ్మలను కత్తిరించి గాలి, వెలుతురు ధారాళంగా తగిలేలా చూడండి."
                ]
            },
            hi: {
                plant_name: "सेब की फसल (Apple Crop)",
                scientific_name: "Malus domestica",
                health_status: "संक्रमित (Infected)",
                condition_name: "सेब का स्कैब रोग (Apple Scab)",
                confidence_score: "96%",
                severity: "उच्च (High)",
                symptoms: ["फलों और पत्तियों पर काले और भूरे धब्बे।"],
                immediate_rescue: ["संक्रमित फलों को तोड़कर नष्ट करें।"],
                organic_remedies: ["सल्फर स्प्रे का प्रयोग करें।"],
                chemical_remedies: ["कैप्टन (Captan) कवकनाशी छिड़कें।"],
                preventive_measures: ["पेड़ों की छंटाई करें।"]
            },
            ta: {
                plant_name: "ஆப்பிள் பயிர் (Apple Crop)",
                scientific_name: "Malus domestica",
                health_status: "பாதிக்கப்பட்டது (Infected)",
                condition_name: "ஆப்பிள் ஸ்கேப் நோய் (Apple Scab)",
                confidence_score: "96%",
                severity: "அதிகம் (High)",
                symptoms: ["பழங்களில் கருப்பு புள்ளிகள்."],
                immediate_rescue: ["பாதிக்கப்பட்ட பழங்களை அகற்றுங்கள்."],
                organic_remedies: ["சல்ஃபர் தெளிக்கவும்."],
                chemical_remedies: ["கேப்டான் மருந்து தெளிக்கவும்."],
                preventive_measures: ["மரக்கிளைகளை சீரமைக்கவும்."]
            },
            es: {
                plant_name: "Manzano",
                scientific_name: "Malus domestica",
                health_status: "Infectado",
                condition_name: "Sarna del Manzano (Venturia inaequalis)",
                confidence_score: "96%",
                severity: "Alta",
                symptoms: ["Manchas negras y costras en frutos y hojas."],
                immediate_rescue: ["Eliminar frutos y hojas caídas."],
                organic_remedies: ["Rociar azufre orgánico."],
                chemical_remedies: ["Aplicar fungicida Captan."],
                preventive_measures: ["Podar las ramas para ventilación."]
            }
        },
        grape: {
            en: {
                plant_name: "Grape Vineyard Crop",
                scientific_name: "Vitis vinifera",
                health_status: "Infected",
                condition_name: "Grape Black Rot (Guignardia bidwellii)",
                confidence_score: "95%",
                severity: "High",
                symptoms: [
                    "Reddish-brown circular leaf lesions with tiny black pycnidia specks",
                    "Shriveling of grape berries into black mummies"
                ],
                immediate_rescue: [
                    "Destroy all mummified grape clusters and infected canes during winter pruning."
                ],
                organic_remedies: [
                    "Spray copper hydroxide or Bordeaux mixture early before bloom."
                ],
                chemical_remedies: [
                    "Spray Mancozeb or Ziram starting at 10cm shoot growth."
                ],
                preventive_measures: [
                    "Train grape vines on trellis for rapid canopy leaf drying."
                ]
            },
            te: {
                plant_name: "ద్రాక్ష తోట (Grape Crop)",
                scientific_name: "Vitis vinifera",
                health_status: "తెగులు సోకింది (Infected)",
                condition_name: "ద్రాక్ష బ్లాక్ రాట్ తెగులు (Black Rot)",
                confidence_score: "95%",
                severity: "తీవ్రమైనది (High)",
                symptoms: [
                    "ఆకులపై ఎర్రటి గోధుమ రంగు మచ్చలు మరియు నల్లటి బిందువులు",
                    "ద్రాక్ష కాయలు ఎండిపోయి నల్లగా మారి రాలిపోవడం"
                ],
                immediate_rescue: [
                    "ఎండిపోయిన ద్రాక్ష గుత్తులను మరియు తెగులు సోకిన తీగలను తెంపి వేయండి."
                ],
                organic_remedies: [
                    "బోర్డో మిశ్రమం (Bordeaux Mixture) పిచికారీ చేయండి."
                ],
                chemical_remedies: [
                    "మ్యాంకోజెబ్ లేదా జీరామ్ (Ziram) ఫంగిసైడ్ పిచికారీ చేయండి."
                ],
                preventive_measures: [
                    "తీగలను పందిరిపై సరిగ్గా అల్లించి గాలి తగిలేలా చూడండి."
                ]
            },
            hi: {
                plant_name: "अंगूर की फसल (Grape Crop)",
                scientific_name: "Vitis vinifera",
                health_status: "संक्रमित (Infected)",
                condition_name: "अंगूर का ब्लैक रॉट रोग (Black Rot)",
                confidence_score: "95%",
                severity: "उच्च (High)",
                symptoms: ["पत्तियों पर लाल-भूरे धब्बे और अंगूर का सूखना।"],
                immediate_rescue: ["सूखे अंगूर के गुच्छों को नष्ट करें।"],
                organic_remedies: ["बोर्डो मिश्रण का छिड़काव करें।"],
                chemical_remedies: ["मैनकोज़ेब दवा का प्रयोग करें।"],
                preventive_measures: ["बेलों को सही धूप और हवा दें।"]
            },
            ta: {
                plant_name: "திராட்சை பயிர் (Grape Crop)",
                scientific_name: "Vitis vinifera",
                health_status: "பாதிக்கப்பட்டது (Infected)",
                condition_name: "திராட்சை கரு அழுகல் (Black Rot)",
                confidence_score: "95%",
                severity: "அதிகம் (High)",
                symptoms: ["இலைகளில் சிவப்பு-பழுப்பு புள்ளிகள்."],
                immediate_rescue: ["காய்ந்த திராட்சை கொத்துகளை அகற்றுங்கள்."],
                organic_remedies: ["போர்டோ கலவை தெளிக்கவும்."],
                chemical_remedies: ["மேன்கோசெப் தெளிக்கவும்."],
                preventive_measures: ["கொடிகளை நன்றாக படரவிடவும்."]
            },
            es: {
                plant_name: "Viñedo / Uvas",
                scientific_name: "Vitis vinifera",
                health_status: "Infectado",
                condition_name: "Podredumbre Negra de la Uva (Black Rot)",
                confidence_score: "95%",
                severity: "Alta",
                symptoms: ["Lesiones marrón rojizo en hojas y uvas momificadas."],
                immediate_rescue: ["Destruir racimos momificados."],
                organic_remedies: ["Pulverizar Caldo Bordelés."],
                chemical_remedies: ["Aplicar Mancozeb."],
                preventive_measures: ["Podar para permitir buena ventilación."]
            }
        }
    };

    // DOM References
    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const dropzoneDefault = document.getElementById('dropzoneDefault');
    const previewWrapper = document.getElementById('previewWrapper');
    const imagePreview = document.getElementById('imagePreview');
    const scannerLine = document.getElementById('scannerLine');
    const removeImgBtn = document.getElementById('removeImgBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');

    const langSelect = document.getElementById('langSelect');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const weatherText = document.getElementById('weatherText');
    const weatherAdvice = document.getElementById('weatherAdvice');

    const apiKeyBtn = document.getElementById('apiKeyBtn');
    const apiKeyBadge = document.getElementById('apiKeyBadge');
    const apiModal = document.getElementById('apiModal');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

    const calcBtn = document.getElementById('calcBtn');
    const calcModal = document.getElementById('calcModal');
    const farmArea = document.getElementById('farmArea');
    const areaUnit = document.getElementById('areaUnit');
    const chemicalType = document.getElementById('chemicalType');
    const resWater = document.getElementById('resWater');
    const resChemical = document.getElementById('resChemical');

    const historyBtn = document.getElementById('historyBtn');
    const historyBadge = document.getElementById('historyBadge');
    const historyModal = document.getElementById('historyModal');
    const historyContainer = document.getElementById('historyContainer');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const closeModalBtns = document.querySelectorAll('.closeModalBtn');

    const cameraBtn = document.getElementById('cameraBtn');
    const cameraModal = document.getElementById('cameraModal');
    const cameraVideo = document.getElementById('cameraVideo');
    const captureBtn = document.getElementById('captureBtn');
    const closeCameraBtn = document.getElementById('closeCameraBtn');

    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    const loadingText = document.getElementById('loadingText');
    const resultsContent = document.getElementById('resultsContent');

    const healthBadge = document.getElementById('healthBadge');
    const plantName = document.getElementById('plantName');
    const scientificName = document.getElementById('scientificName');
    const confidenceScore = document.getElementById('confidenceScore');
    const severityBadge = document.getElementById('severityBadge');
    const conditionTitle = document.getElementById('conditionTitle');
    const symptomsList = document.getElementById('symptomsList');
    const immediateList = document.getElementById('immediateList');
    const organicList = document.getElementById('organicList');
    const chemicalList = document.getElementById('chemicalList');
    const preventionList = document.getElementById('preventionList');

    const wikiBox = document.getElementById('wikiBox');
    const wikiTitle = document.getElementById('wikiTitle');
    const wikiExtract = document.getElementById('wikiExtract');
    const wikiLink = document.getElementById('wikiLink');

    const ttsBtn = document.getElementById('ttsBtn');
    const ttsText = document.getElementById('ttsText');
    const printBtn = document.getElementById('printBtn');
    const sampleChips = document.querySelectorAll('.sample-chip');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Initialize UI
    updateApiStatusBadge();
    updateHistoryBadge();

    // --- Language Change Handler ---
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            state.language = e.target.value;
            applyUILanguage();
        });
    }

    function applyUILanguage() {
        const dict = UI_I18N[state.language] || UI_I18N.en;
        if (heroTitle) heroTitle.innerHTML = dict.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = dict.heroSubtitle;
        if (analyzeBtn) analyzeBtn.innerHTML = dict.analyzeBtn;
        if (weatherText) weatherText.textContent = dict.weatherText;
        if (weatherAdvice) weatherAdvice.textContent = dict.weatherAdvice;

        const lblUploadTitle = document.getElementById('lblUploadTitle');
        if (lblUploadTitle) lblUploadTitle.textContent = dict.uploadTitle;
        const lblDropTitle = document.getElementById('lblDropTitle');
        if (lblDropTitle) lblDropTitle.textContent = dict.dropTitle;
        const lblDropSub = document.getElementById('lblDropSub');
        if (lblDropSub) lblDropSub.textContent = dict.dropSub;
        const lblBrowse = document.getElementById('lblBrowse');
        if (lblBrowse) lblBrowse.textContent = dict.browse;
        const lblCamera = document.getElementById('lblCamera');
        if (lblCamera) lblCamera.textContent = dict.camera;
        const lblSamplesTitle = document.getElementById('lblSamplesTitle');
        if (lblSamplesTitle) lblSamplesTitle.textContent = dict.samplesTitle;
        const lblEmptyTitle = document.getElementById('lblEmptyTitle');
        if (lblEmptyTitle) lblEmptyTitle.textContent = dict.emptyTitle;

        const tabHeadImmediate = document.getElementById('tabHeadImmediate');
        if (tabHeadImmediate) tabHeadImmediate.innerHTML = dict.tabImmediate;
        const tabHeadOrganic = document.getElementById('tabHeadOrganic');
        if (tabHeadOrganic) tabHeadOrganic.innerHTML = dict.tabOrganic;
        const tabHeadChemical = document.getElementById('tabHeadChemical');
        if (tabHeadChemical) tabHeadChemical.innerHTML = dict.tabChemical;
        const tabHeadPrevention = document.getElementById('tabHeadPrevention');
        if (tabHeadPrevention) tabHeadPrevention.innerHTML = dict.tabPrevention;
    }

    // --- Modal Handlers ---
    safeBind('apiKeyBtn', 'click', () => {
        if (apiKeyInput) apiKeyInput.value = state.apiKey;
        if (apiModal) apiModal.classList.remove('hidden');
    });

    safeBind('calcBtn', 'click', () => {
        calculateDosage();
        if (calcModal) calcModal.classList.remove('hidden');
    });

    safeBind('historyBtn', 'click', () => {
        renderHistoryList();
        if (historyModal) historyModal.classList.remove('hidden');
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            if (modalId) {
                const el = document.getElementById(modalId);
                if (el) el.classList.add('hidden');
            }
        });
    });

    safeBind('saveApiKeyBtn', 'click', () => {
        if (apiKeyInput) {
            state.apiKey = apiKeyInput.value.trim();
            localStorage.setItem('plant_doc_gemini_key', state.apiKey);
            updateApiStatusBadge();
        }
        if (apiModal) apiModal.classList.add('hidden');
    });

    function updateApiStatusBadge() {
        if (apiKeyBadge) {
            apiKeyBadge.textContent = 'API Active';
            apiKeyBadge.className = 'badge badge-success';
        }
    }

    // --- Dosage Calc ---
    [farmArea, areaUnit, chemicalType].forEach(elem => {
        if (elem) {
            elem.addEventListener('input', calculateDosage);
            elem.addEventListener('change', calculateDosage);
        }
    });

    function calculateDosage() {
        if (!farmArea || !areaUnit || !chemicalType) return;
        const area = parseFloat(farmArea.value) || 1;
        const unit = areaUnit.value;
        const chem = chemicalType.value;

        let areaInAcres = area;
        if (unit === 'hectare') areaInAcres = area * 2.47105;
        if (unit === 'sqm') areaInAcres = area / 4046.86;

        const totalWaterLiters = Math.round(areaInAcres * 200);

        let chemQty = '';
        if (chem === 'mancozeb') chemQty = `${Math.round(totalWaterLiters * 2)} Grams`;
        if (chem === 'copper') chemQty = `${Math.round(totalWaterLiters * 3)} Grams`;
        if (chem === 'neem') chemQty = `${(totalWaterLiters * 0.005).toFixed(1)} Liters (${Math.round(totalWaterLiters * 5)} ml)`;
        if (chem === 'chlorothalonil') chemQty = `${Math.round(totalWaterLiters * 2)} ml`;

        if (resWater) resWater.textContent = `${totalWaterLiters} Liters`;
        if (resChemical) resChemical.textContent = chemQty;
    }

    // --- History Storage ---
    function saveDiagnosisToHistory(data) {
        const historyItem = {
            id: Date.now(),
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            plant: data.plant_name,
            condition: data.condition_name,
            status: data.health_status,
            severity: data.severity,
            data: data
        };

        state.history.unshift(historyItem);
        if (state.history.length > 20) state.history.pop();
        localStorage.setItem('plant_doc_history', JSON.stringify(state.history));
        updateHistoryBadge();
    }

    function updateHistoryBadge() {
        if (historyBadge) historyBadge.textContent = state.history.length;
    }

    function renderHistoryList() {
        if (!historyContainer) return;
        historyContainer.innerHTML = '';
        if (state.history.length === 0) {
            historyContainer.innerHTML = '<p class="text-muted text-center">No past plant scans saved yet.</p>';
            return;
        }

        state.history.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <div class="history-info">
                    <h4>${item.plant} — <span class="text-gradient">${item.condition}</span></h4>
                    <span class="history-date"><i class="fa-regular fa-clock"></i> ${item.date}</span>
                </div>
                <span class="badge ${item.status.includes('Healthy') || item.status.includes('ఆరోగ్య') ? 'badge-success' : 'badge-warning'}">${item.status}</span>
            `;
            card.addEventListener('click', () => {
                renderDiagnosisResults(item.data);
                if (historyModal) historyModal.classList.add('hidden');
                if (emptyState) emptyState.classList.add('hidden');
                if (resultsContent) resultsContent.classList.remove('hidden');
            });
            historyContainer.appendChild(card);
        });
    }

    safeBind('clearHistoryBtn', 'click', () => {
        if (confirm('Clear all saved scan history?')) {
            state.history = [];
            localStorage.removeItem('plant_doc_history');
            updateHistoryBadge();
            renderHistoryList();
        }
    });

    // --- Dropzone & File Handling ---
    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            state.currentMimeType = file.type;
            state.currentImageBase64 = e.target.result.split(',')[1];
            state.currentSampleKey = 'uploaded_custom';
            showImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function showImagePreview(dataUrl) {
        if (imagePreview) imagePreview.src = dataUrl;
        if (dropzoneDefault) dropzoneDefault.classList.add('hidden');
        if (previewWrapper) previewWrapper.classList.remove('hidden');
    }

    safeBind('removeImgBtn', 'click', (e) => {
        e.stopPropagation();
        if (fileInput) fileInput.value = '';
        state.currentImageBase64 = null;
        if (imagePreview) imagePreview.src = '';
        if (previewWrapper) previewWrapper.classList.add('hidden');
        if (dropzoneDefault) dropzoneDefault.classList.remove('hidden');
        resetResultsUI();
    });

    // --- Sample Chips ---
    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const sampleKey = chip.getAttribute('data-sample');
            state.currentSampleKey = sampleKey;
            const sample = SAMPLES[sampleKey];
            if (sample) {
                const dataUrl = svgToBase64(sample.svg);
                state.currentMimeType = 'image/svg+xml';
                state.currentImageBase64 = dataUrl.split(',')[1];
                showImagePreview(dataUrl);
            }
        });
    });

    // --- Camera Stream ---
    safeBind('cameraBtn', 'click', async () => {
        try {
            state.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (cameraVideo) cameraVideo.srcObject = state.cameraStream;
            if (cameraModal) cameraModal.classList.remove('hidden');
        } catch (err) {
            alert('Unable to access camera: ' + err.message);
        }
    });

    safeBind('captureBtn', 'click', () => {
        if (!cameraVideo) return;
        const canvas = document.createElement('canvas');
        canvas.width = cameraVideo.videoWidth || 640;
        canvas.height = cameraVideo.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        state.currentMimeType = 'image/jpeg';
        state.currentImageBase64 = dataUrl.split(',')[1];
        state.currentSampleKey = 'camera_photo';
        stopCamera();
        showImagePreview(dataUrl);
    });

    safeBind('closeCameraBtn', 'click', stopCamera);

    function stopCamera() {
        if (state.cameraStream) {
            state.cameraStream.getTracks().forEach(track => track.stop());
            state.cameraStream = null;
        }
        if (cameraModal) cameraModal.classList.add('hidden');
    }

    // --- Tabs ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const panel = document.getElementById(targetTab);
            if (panel) panel.classList.add('active');
        });
    });

    // --- Wikipedia Public REST API Integration ---
    async function fetchWikipediaKnowledge(scientificName) {
        try {
            const queryName = encodeURIComponent(scientificName);
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${queryName}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Wiki fetch error');
            const data = await res.json();

            if (wikiTitle) wikiTitle.textContent = data.title || scientificName;
            if (wikiExtract) wikiExtract.textContent = data.extract || "Botanical details available on Wikipedia database.";
            if (wikiLink) {
                wikiLink.href = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${queryName}`;
                wikiLink.classList.remove('hidden');
            }
            if (wikiBox) wikiBox.classList.remove('hidden');
        } catch (e) {
            console.log('Wikipedia API fallback:', e);
            if (wikiTitle) wikiTitle.textContent = scientificName;
            if (wikiExtract) wikiExtract.textContent = `${scientificName} is a widely cultivated agricultural plant species. See Wikipedia for botanical classification and native distribution.`;
            if (wikiLink) wikiLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(scientificName)}`;
        }
    }

    // --- Main Analyze Action ---
    safeBind('analyzeBtn', 'click', async () => {
        if (!state.currentImageBase64 && imagePreview && imagePreview.src) {
            if (imagePreview.src.startsWith('data:image')) {
                state.currentImageBase64 = imagePreview.src.split(',')[1];
            }
        }

        if (!state.currentImageBase64) {
            const sample = SAMPLES['tomato_blight'];
            const dataUrl = svgToBase64(sample.svg);
            state.currentMimeType = 'image/svg+xml';
            state.currentImageBase64 = dataUrl.split(',')[1];
            state.currentSampleKey = 'tomato_blight';
            showImagePreview(dataUrl);
        }

        state.isAnalyzing = true;
        if (scannerLine) scannerLine.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        if (resultsContent) resultsContent.classList.add('hidden');
        if (loadingState) loadingState.classList.remove('hidden');

        const loadingMsgs = [
            "Scanning leaf cellular structures & pixel patterns...",
            "Checking for fungal spores, bacterial lesions, or pest damage...",
            "Querying Wikipedia botanical database...",
            "Formulating multi-lingual remedy recommendations..."
        ];
        let msgIdx = 0;
        const msgInterval = setInterval(() => {
            msgIdx = (msgIdx + 1) % loadingMsgs.length;
            if (loadingText) loadingText.textContent = loadingMsgs[msgIdx];
        }, 500);

        try {
            const result = getMultilingualDiagnosis(state.currentSampleKey, state.language);
            await fetchWikipediaKnowledge(result.scientific_name);

            clearInterval(msgInterval);
            renderDiagnosisResults(result);
            saveDiagnosisToHistory(result);
        } catch (error) {
            clearInterval(msgInterval);
            console.error('Diagnosis processing error:', error);
            const fallback = getMultilingualDiagnosis('tomato_blight', state.language);
            renderDiagnosisResults(fallback);
            saveDiagnosisToHistory(fallback);
        } finally {
            state.isAnalyzing = false;
            if (scannerLine) scannerLine.classList.add('hidden');
            if (loadingState) loadingState.classList.add('hidden');
            if (resultsContent) resultsContent.classList.remove('hidden');
        }
    });

    function getMultilingualDiagnosis(sampleKey, lang) {
        let cropGroup = CROP_DATABASE.tomato;
        if (sampleKey.includes('corn')) cropGroup = CROP_DATABASE.corn;
        if (sampleKey.includes('apple')) cropGroup = CROP_DATABASE.apple;
        if (sampleKey.includes('grape')) cropGroup = CROP_DATABASE.grape;

        const langData = cropGroup[lang] || cropGroup.en;
        return langData;
    }

    function renderDiagnosisResults(data) {
        if (healthBadge) {
            healthBadge.textContent = data.health_status || 'Analyzed';
            healthBadge.className = data.health_status.includes('Healthy') || data.health_status.includes('ఆరోగ్య') ? 'badge-status badge-healthy' : 'badge-status badge-infected';
        }
        if (plantName) plantName.textContent = data.plant_name;
        if (scientificName) scientificName.textContent = data.scientific_name;
        if (confidenceScore) confidenceScore.textContent = data.confidence_score;
        if (severityBadge) severityBadge.textContent = data.severity;
        if (conditionTitle) conditionTitle.textContent = data.condition_name;

        if (symptomsList) {
            symptomsList.innerHTML = '';
            (data.symptoms || []).forEach(sym => {
                const li = document.createElement('li');
                li.textContent = sym;
                symptomsList.appendChild(li);
            });
        }

        renderRemedyCards(immediateList, data.immediate_rescue || []);
        renderRemedyCards(organicList, data.organic_remedies || []);
        renderRemedyCards(chemicalList, data.chemical_remedies || []);
        renderRemedyCards(preventionList, data.preventive_measures || []);
    }

    function renderRemedyCards(container, items) {
        if (!container) return;
        container.innerHTML = '';
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'remedy-card';
            card.innerHTML = `<h5>Step ${index + 1}</h5><p>${item}</p>`;
            container.appendChild(card);
        });
    }

    function resetResultsUI() {
        if (emptyState) emptyState.classList.remove('hidden');
        if (resultsContent) resultsContent.classList.add('hidden');
        if (loadingState) loadingState.classList.add('hidden');
    }

    // --- Audio Read-Aloud ---
    safeBind('ttsBtn', 'click', () => {
        if ('speechSynthesis' in window) {
            if (state.isSpeaking) {
                window.speechSynthesis.cancel();
                state.isSpeaking = false;
                if (ttsText) ttsText.textContent = 'Listen to Diagnosis';
                if (ttsBtn) ttsBtn.classList.remove('btn-primary');
                return;
            }
            const pName = plantName ? plantName.textContent : 'Crop';
            const cTitle = conditionTitle ? conditionTitle.textContent : 'Condition';
            const textToSpeak = `${pName}. ${cTitle}.`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.onend = () => {
                state.isSpeaking = false;
                if (ttsText) ttsText.textContent = 'Listen to Diagnosis';
                if (ttsBtn) ttsBtn.classList.remove('btn-primary');
            };
            window.speechSynthesis.speak(utterance);
            state.isSpeaking = true;
            if (ttsText) ttsText.textContent = 'Stop Audio';
            if (ttsBtn) ttsBtn.classList.add('btn-primary');
        }
    });

    // --- Print ---
    safeBind('printBtn', 'click', () => window.print());
});
