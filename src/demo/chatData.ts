import type { ChatMessage } from "@/types/chat";

export function getDemoChatReply(message: string, language: string): ChatMessage {
  const query = message.toLowerCase();
  let reply = "I recommend pruning affected lower leaves, maintaining 60cm row spacing, and applying Neem oil or copper-based fungicides every 7 days.";

  if (language === "te") {
    if (query.includes("వర్షం") || query.includes("వర్ష")) {
      reply = "వర్షం పడుతున్నప్పుడు ఫంగిసైడ్ పిచికారీ చేయవద్దు. వర్షం ఆగిన తర్వాత ఎండ ఉన్న సమయంలో మందులు చల్లండి.";
    } else {
      reply = "మీ పంట ఆరోగ్యానికి వేప నూనె (Neem Oil 5ml/L) మరియు సేంద్రీయ ఎరువులు క్రమం తప్పకుండా అందించడం మంచిది.";
    }
  } else if (language === "hi") {
    reply = "जैविक नीम के तेल (5ml/लीटर) का छिड़काव फसल को कीटों और फफूंद से बचाता है। बारिश के दौरान छिड़काव न करें।";
  } else if (query.includes("rain") || query.includes("weather")) {
    reply = "Avoid spraying fungicides during rainy weather as rainwater washes away active ingredients. Spray early morning on clear days.";
  } else if (query.includes("neem") || query.includes("organic")) {
    reply = "Neem Oil emulsion (5ml per Liter water) works effectively against aphids, whiteflies, and early fungal spores.";
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: reply,
    language,
    createdAt: new Date().toISOString()
  };
}
