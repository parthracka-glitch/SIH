/**
 * Arogya Mitra — Rural Clinical NLP Triage Engine & Diagnostic Knowledge Base
 * Specially trained for Indian rural/tribal primary healthcare patterns.
 * Supports: Hinglish, Devanagari Hindi, Marathi, and English.
 */

export interface TriageResult {
  suspectedCondition: string;
  conditionHindi: string;
  confidenceScore: number;
  triageLevel: "ROUTINE" | "MODERATE" | "URGENT" | "CRITICAL_108";
  department: string;
  facilityTier: string;
  detectedSymptoms: string[];
  explanationHindi: string;
  explanationEnglish: string;
  recommendedTests: string[];
  safeFirstAid: string[];
  redFlags: string[];
  quickReplies: string[];
  isEmergency: boolean;
}

interface DiseaseRule {
  id: string;
  nameEn: string;
  nameHi: string;
  department: string;
  facilityTier: string;
  triageLevel: "ROUTINE" | "MODERATE" | "URGENT" | "CRITICAL_108";
  isEmergency: boolean;
  triggers: string[];
  requiredKeywords?: string[][]; // e.g. [fever triggers] AND [chills triggers]
  excludeTriggers?: string[];
  explanationEn: string;
  explanationHi: string;
  tests: string[];
  firstAid: string[];
  redFlags: string[];
  quickReplies: string[];
}

// Comprehensive Rural & Tropical Disease Knowledge Matrix
const RURAL_DISEASE_RULES: DiseaseRule[] = [
  // 1. Malaria (Fever + Chills / Rigors)
  {
    id: "malaria",
    nameEn: "Suspected Malaria (Plasmodium vivax / falciparum)",
    nameHi: "संभावित मलेरिया (ठंड व कपकपी वाला बुखार)",
    department: "General Medicine / Vector-Borne Diseases",
    facilityTier: "Ayushman Arogya Mandir (AAM) / PHC",
    triageLevel: "URGENT",
    isEmergency: false,
    triggers: [
      "malaria", "thand", "thandi", "thandie", "kapkapi", "shivering", "chills", "rigor", "rigors",
      "sardi", "sheet", "thad", "थंड", "कपकपी", "ठंड लगना", "थंडी"
    ],
    requiredKeywords: [
      ["bukhar", "fever", "taap", "tap", "garam", "temper", "ताप", "बुखार"],
      ["thand", "thandi", "thandie", "kapkapi", "shivering", "chills", "rigor", "rigors", "थंड", "कपकपी"]
    ],
    explanationEn: "Fever accompanied by shivering and chills is a hallmark symptom of Malaria in rural endemic regions. The parasite cycles cause intense cold stages followed by high fever spikes.",
    explanationHi: "तेज़ बुखार के साथ ठंड और कपकपी लगना ग्रामीण क्षेत्रों में मुख्य रूप से मलेरिया का प्रमुख संकेत है। यह एनोफिलीज मच्छर के काटने से फैलता है।",
    tests: [
      "Malarial Rapid Diagnostic Test (RDT) at Sub-Center / PHC (Free)",
      "Thick & Thin Blood Smear for MP (Microscopy)",
      "Complete Blood Count (CBC) with Platelets"
    ],
    firstAid: [
      "Jan Aushadhi Paracetamol 500mg (1 tablet after food for fever > 100°F).",
      "Do NOT take pain-relievers like Brufen / Diclofenac without doctor review.",
      "Drink plenty of boiled water, coconut water, or ORS to prevent dehydration.",
      "Use mosquito nets (LLIN) to prevent transmission to family members."
    ],
    redFlags: [
      "Excessive drowsiness, confusion, or delirium (Cerebral Malaria risk)",
      "Yellowing of eyes / dark colored urine (Hemoglobinuria)",
      "Inability to eat or persistent vomiting"
    ],
    quickReplies: ["बुखार कितने दिन से है?", "क्या सिर दर्द भी है?", "खून की जांच कहां होगी?"]
  },

  // 2. Dengue / Breakbone Fever
  {
    id: "dengue",
    nameEn: "Suspected Dengue / Arboviral Infection",
    nameHi: "संभावित डेंगू (हड्डी-तोड़ बुखार)",
    department: "General Medicine / Infectious Disease",
    facilityTier: "Primary Health Centre (PHC) / CHC",
    triageLevel: "URGENT",
    isEmergency: false,
    triggers: [
      "dengue", "dengu", "retro-orbital", "aankhon ke peeche dard", "haddi tod", "breakbone",
      "platelet", "red spots", "lal chakatte", "badan dard", "joint pain fever"
    ],
    requiredKeywords: [
      ["bukhar", "fever", "taap", "ताप", "बुखार"],
      ["badan dard", "body ache", "aankh", "eye", "joint", "haddi", "dard", "red spot", "chakatte", "platelet"]
    ],
    explanationEn: "High continuous fever with severe body ache, retro-orbital eye pain, or joint pain suggests Dengue fever. Platelet monitoring is essential.",
    explanationHi: "अचानक तेज़ बुखार के साथ आंखों के पीछे दर्द, गंभीर बदन दर्द और जोड़ों में टूटन डेंगू के लक्षण हैं। इसमें प्लेटलेट्स की निगरानी आवश्यक है।",
    tests: [
      "Dengue NS1 Antigen (Day 1-5) or IgM Antibody (Day 5+)",
      "Daily Platelet Count & Hematocrit (HCT) Monitoring",
      "Liver Function Test (SGOT/SGPT)"
    ],
    firstAid: [
      "Strict Bed Rest with minimum 3-4 Liters fluid intake (ORS, lemon water, soup).",
      "Paracetamol 500mg only for fever. AVOID Aspirin / Ibuprofen strictly as they cause internal bleeding.",
      "Papaya leaf extract / kiwi can be taken as supportive nutritional care."
    ],
    redFlags: [
      "Bleeding from gums, nose, or blood in stool/vomit (Dengue Hemorrhagic Alert)",
      "Severe abdominal pain or continuous vomiting",
      "Cold, clammy skin or sudden drop in blood pressure"
    ],
    quickReplies: ["प्लेटलेट कैसे बढ़ाएं?", "क्या खून बह रहा है?", "नजदीकी अस्पताल कौन सा है?"]
  },

  // 3. Acute Diarrhea & Dehydration / Cholera
  {
    id: "diarrhea",
    nameEn: "Acute Gastroenteritis / Diarrhea with Dehydration Risk",
    nameHi: "तीव्र दस्त व डिहाइड्रेशन (उल्टी-दस्त)",
    department: "Pediatrics / General OPD",
    facilityTier: "Sub-Center / PHC (Oral Rehydration Corner)",
    triageLevel: "MODERATE",
    isEmergency: false,
    triggers: [
      "dast", "patle dast", "loose motion", "diarrhea", "ulti", "vomiting", "pet kharab", "marod",
      "cramps", "haiza", "cholera", "pani jaisa dast", "जुलाब", "उलटी", "दस्त", "मरोड़"
    ],
    explanationEn: "Frequent watery stools and vomiting can lead to dangerous hypovolemic dehydration, especially in hot rural conditions or monsoons.",
    explanationHi: "पतले दस्त और उल्टी से शरीर में पानी और नमक की गंभीर कमी (डिहाइड्रेशन) हो सकती है। इसे तुरंत ओआरएस से नियंत्रित करना जरूरी है।",
    tests: [
      "Stool Routine & Microscopy (if mucus/blood present)",
      "Serum Electrolytes (Na+, K+, Cl-)",
      "Random Blood Sugar"
    ],
    firstAid: [
      "ORS (Oral Rehydration Salts): Dissolve 1 full packet in 1 Liter clean boiled water. Sip after every loose stool.",
      "Jan Aushadhi Zinc Sulfate 20mg daily for 14 days (reduces duration and recurrence).",
      "Continue normal feeding: Rice kanji (daal-khichdi), buttermilk, coconut water."
    ],
    redFlags: [
      "Sunken eyes, dry tongue, or loss of skin elasticity",
      "No urine output for over 6 hours (Kidney hypoperfusion)",
      "Lethargy or unconsciousness (Requires IV Ringer Lactate immediately)"
    ],
    quickReplies: ["ORS का घोल कैसे बनाएं?", "उल्टी कैसे रोकें?", "बच्चे को क्या खिलाएं?"]
  },

  // 4. Cardiac Emergency (Chest Pain / Heart Attack)
  {
    id: "cardiac_emergency",
    nameEn: "Acute Coronary Syndrome (Suspected Myocardial Infarction)",
    nameHi: "गंभीर हृदय आपातकाल (हार्ट अटैक का संदेह)",
    department: "Emergency Trauma / ICU",
    facilityTier: "District Hospital / Tertiary Cardiology Hub",
    triageLevel: "CRITICAL_108",
    isEmergency: true,
    triggers: [
      "chest pain", "chhati me dard", "seene me dard", "dil me dard", "chhati", "heart", "attack",
      "left arm", "pasina", "sweating", "ghabrahat", "seene me jalan", "छाती में दर्द", "हार्ट अटैक"
    ],
    explanationEn: "CRITICAL RED FLAG: Substernal heavy chest tightness radiating to arm or jaw accompanied by cold sweating indicates active cardiac ischemia.",
    explanationHi: "अति-आपातकालीन चेतावनी: सीने में भारीपन, दबाव, बाएं हाथ में जाता हुआ दर्द और ठंडा पसीना दिल के दौरे (हार्ट अटैक) का संकेत हो सकता है। तुरंत 108 डायल करें।",
    tests: [
      "Immediate 12-Lead Electrocardiogram (ECG)",
      "Troponin-T / Troponin-I Quantitative Marker",
      "Continuous Cardiac Rhythm & Blood Pressure Monitoring"
    ],
    firstAid: [
      "DIAL 108 IMMEDIATELY for Emergency Ambulance with defibrillator.",
      "If advised by doctor: Chew non-enteric Dispirin / Aspirin 300mg immediately.",
      "Keep patient in comfortable half-seated position. Loosen tight clothing. Do NOT exert."
    ],
    redFlags: [
      "Crushing retrosternal chest pain > 15 minutes",
      "Loss of consciousness or severe breathlessness",
      "Bluish discoloration of lips / nails (Cyanosis)"
    ],
    quickReplies: ["108 पर फोन करें", "मरीज को कैसे लिटाएं?", "नजदीकी आईसीयू कहां है?"]
  },

  // 5. Snakebite / Envenomation
  {
    id: "snakebite",
    nameEn: "Acute Snakebite / Ophitoxemia Emergency",
    nameHi: "सर्पदंश आपातकाल (सांप का काटना)",
    department: "Emergency Resuscitation",
    facilityTier: "CHC / Sub-District / District Hospital (ASV Center)",
    triageLevel: "CRITICAL_108",
    isEmergency: true,
    triggers: [
      "saanp", "sanp", "snake", "snakebite", "kat liya", "dant", "fangs", "zeher", "poison",
      "saap", "सर्प", "सांप ने काटा", "विषकन्या", "नाग"
    ],
    explanationEn: "CRITICAL EMERGENCY: Venomous snakebites (Cobra, Krait, Russell's Viper, Saw-scaled Viper) cause neuromuscular paralysis or severe coagulopathy. Anti-Snake Venom (ASV) is mandatory.",
    explanationHi: "अति-आपातकालीन चेतावनी: भारत के 'बिग 4' जहरीले सांपों का काटना जानलेवा हो सकता है। झाड़-फूंक में समय बर्बाद न करें, सीधे ASV वाले सरकारी अस्पताल जाएं।",
    tests: [
      "20-Minute Whole Blood Clotting Test (20WBCT) for Viperine Hemotoxicity",
      "Single Breath Count & Peak Expiratory Flow for Neurotoxicity",
      "Urine Examination for Hematuria / Myoglobinuria"
    ],
    firstAid: [
      "IMMOBILIZE THE BITTEN LIMB with a splint/cloth (keep like a fractured arm).",
      "DO NOT cut, suck, wash, or apply tight tourniquets (causes gangrene and limb loss).",
      "Remove rings, bangles, or tight shoes before swelling develops.",
      "Rush directly to nearest CHC or District Hospital for Polyvalent ASV injection."
    ],
    redFlags: [
      "Drooping eyelids (Ptosis) or difficulty speaking/swallowing (Neurotoxic paralysis)",
      "Bleeding from bite marks, gums, or urine",
      "Rapidly spreading painful swelling up the limb"
    ],
    quickReplies: ["108 एम्बुलेंस बुलाएं", "एंटी-वेनम कहां मिलेगा?", "सांप की पहचान कैसे करें?"]
  },

  // 6. Tuberculosis (TB) / Chronic Cough
  {
    id: "tb",
    nameEn: "Suspected Pulmonary Tuberculosis (Presumptive TB)",
    nameHi: "संभावित टीबी (क्षय रोग / पुराना खांसी)",
    department: "Pulmonary Medicine / RNTCP Clinic",
    facilityTier: "PHC / CHC Designated Microscopy Center (DMC)",
    triageLevel: "MODERATE",
    isEmergency: false,
    triggers: [
      "tb", "tuberculosis", "balgam me khoon", "khoon wali khansi", "hemoptysis", "purani khansi",
      "2 hafte se khansi", "raat ko paseena", "wazan kam", "chulha dhuan", "टीबी", "खांसी में खून"
    ],
    explanationEn: "Persistent cough for more than 2 weeks, accompanied by low evening fever, night sweats, or blood in sputum, warrants presumptive TB screening.",
    explanationHi: "2 सप्ताह से अधिक की लगातार खांसी, शाम को बुखार, रात में पसीना और वजन का घटना टीबी के लक्षण हैं। सरकार द्वारा इसकी मुफ्त जांच और इलाज उपलब्ध है।",
    tests: [
      "NAAT / CBNAAT (GeneXpert) for Mycobacterium tuberculosis & Rifampicin resistance",
      "Sputum Smear Microscopy for Acid-Fast Bacilli (AFB)",
      "Digital Chest X-Ray (PA View)"
    ],
    firstAid: [
      "Visit PHC for free CBNAAT test under National Tuberculosis Elimination Program (NTEP).",
      "Cover mouth with a cloth or mask when coughing to protect children and family.",
      "Nutritious high-protein diet (dal, milk, eggs, pulses). Register on Nikshay for monthly financial aid."
    ],
    redFlags: [
      "Coughing up large volumes of fresh red blood (Massive Hemoptysis)",
      "Severe chest pain and sudden worsening breathlessness",
      "Extreme weight loss and weakness"
    ],
    quickReplies: ["मुफ्त जांच कहां होगी?", "निक्षय योजना क्या है?", "क्या यह परिवार में फैलता है?"]
  },

  // 7. Maternal High Risk / Preeclampsia
  {
    id: "maternal_emergency",
    nameEn: "High-Risk Pregnancy / Severe Preeclampsia",
    nameHi: "गर्भावस्था में उच्च जोखिम (प्री-एक्लेमप्सिया)",
    department: "Obstetrics & Gynecology (MCH)",
    facilityTier: "First Referral Unit (FRU) / District Hospital",
    triageLevel: "URGENT",
    isEmergency: true,
    triggers: [
      "garbhvati", "pregnant", "pregnancy", "garbh", "bachha", "mahina chadhna", "anc", "preeclampsia",
      "garbhavastha", "pregnant bukhar", "गर्भवती", "गर्भ", "गर्भावस्था"
    ],
    requiredKeywords: [
      ["garbhvati", "pregnant", "pregnancy", "garbh", "गर्भवती"],
      ["bp", "sir dard", "headache", "dhundhla", "sujan", "edema", "bleeding", "dard", "chakkar"]
    ],
    explanationEn: "Severe headache, blurred vision, sudden facial/pedal swelling, or high BP in pregnancy indicates preeclampsia, a life-threatening risk for mother and fetus.",
    explanationHi: "गर्भावस्था में तेज सिरदर्द, आंखों में धुंधलापन, चेहरे और पैरों में सूजन या उच्च रक्तचाप प्री-एक्लेमप्सिया का संकेत है। इसमें तुरंत विशेषज्ञ देखभाल आवश्यक है।",
    tests: [
      "Immediate Blood Pressure Screening (Target < 140/90 mmHg)",
      "Urine Dipstick for Albumin / Proteinuria",
      "Obstetric Ultrasound (USG) for Fetal Well-being & Placental Doppler"
    ],
    firstAid: [
      "Contact your village ANM / ASHA worker immediately.",
      "Labetalol is safe in pregnancy under physician prescription; do NOT take standard BP tablets.",
      "Maintain absolute rest in left-lateral position to maximize uterine blood flow."
    ],
    redFlags: [
      "Seizures or fits (Eclampsia emergency - requires IV Magnesium Sulfate)",
      "Vaginal bleeding or sudden severe lower abdominal pain",
      "Absence of fetal movements for over 6 hours"
    ],
    quickReplies: ["आशा दीदी को संपर्क करें", "108 एम्बुलेंस बुलाएं", "अस्पताल में क्या जांच होगी?"]
  },

  // 8. Heat Stroke / Loo
  {
    id: "heatstroke",
    nameEn: "Heat Hyperpyrexia / Severe Heat Exhaustion (Loo)",
    nameHi: "लू लगना व अत्यधिक तापघात (Heat Stroke)",
    department: "Emergency / General Medicine",
    facilityTier: "PHC / CHC Cool Ward",
    triageLevel: "URGENT",
    isEmergency: false,
    triggers: [
      "loo", "loo lagna", "heat stroke", "dhoop me bukhar", "garmi", "paseena band", "dhoop",
      "heat wave", "लू", "धूप", "गर्मी में बुखार"
    ],
    explanationEn: "High environmental temperatures combined with farm field labor can cause thermoregulatory failure with body temperature spiking > 104°F and cessation of sweating.",
    explanationHi: "कड़कती धूप या खेत में काम करने से शरीर का तापमान नियंत्रण बिगड़ जाता है। पसीना बंद होना और 104°F से ऊपर बुखार लू लगने का गंभीर संकेत है।",
    tests: [
      "Continuous Core Body Temperature Monitoring",
      "Serum Electrolytes & Blood Urea / Creatinine",
      "Urine Specific Gravity"
    ],
    firstAid: [
      "Move patient immediately to cool shade / well-ventilated area.",
      "Spray cold water on body and fan vigorously; apply ice packs to neck, armpits, and groin.",
      "Sip cold ORS water, raw mango panna (aam panna), or salted buttermilk if conscious."
    ],
    redFlags: [
      "Altered mental status, confusion, or convulsions",
      "Body temperature above 104°F with dry, hot skin",
      "Loss of consciousness or inability to drink"
    ],
    quickReplies: ["ठंडी पट्टी कैसे रखें?", "ओआरएस कैसे दें?", "मरीज को कहां ले जाएं?"]
  },

  // 9. Chronic Hypertension / High Blood Pressure
  {
    id: "hypertension",
    nameEn: "Essential Hypertension / Stage 2 Crisis",
    nameHi: "उच्च रक्तचाप (हाई ब्लड प्रेशर / बीपी)",
    department: "General Medicine / NCD Clinic",
    facilityTier: "PHC NCD Clinic / Jan Aushadhi Dispensary",
    triageLevel: "MODERATE",
    isEmergency: false,
    triggers: [
      "high bp", "blood pressure", "bp", "sir ghoomna", "sir me dard peeche", "chakkar", "tention",
      "ghabrahat", "बीपी", "रक्तचाप", "सिर घूमना"
    ],
    explanationEn: "Persistent occipital headaches, dizziness, or neck stiffness often correlate with uncontrolled blood pressure. Regular screening prevents stroke.",
    explanationHi: "सिर के पिछले हिस्से में भारीपन, चक्कर आना और घबराहट हाई बीपी के लक्षण हो सकते हैं। इसे नियंत्रित न करने पर लकवा (स्ट्रोक) का खतरा होता है।",
    tests: [
      "Serial BP Measurement (3 readings spaced 5 minutes apart)",
      "Lipid Profile & Serum Creatinine",
      "Urine Routine for Microalbuminuria"
    ],
    firstAid: [
      "Visit PHC or Ayushman Arogya Mandir (AAM) for free digital BP measurement.",
      "Reduce salt intake to less than 1 teaspoon per day (no added papad, pickles, or namkeen).",
      "Take Jan Aushadhi generic Telmisartan 40mg or Amlodipine 5mg regularly as prescribed."
    ],
    redFlags: [
      "BP reading systolic >= 180 or diastolic >= 110 mmHg (Hypertensive Crisis)",
      "Sudden weakness on one side of face, arm, or leg (Stroke warning)",
      "Severe chest pain or shortness of breath"
    ],
    quickReplies: ["नमक कितना कम करें?", "मुफ्त दवा कहां मिलेगी?", "बीपी सामान्य कितना होना चाहिए?"]
  },

  // 10. General Acute Fever (Turn 1 / Undifferentiated)
  {
    id: "acute_fever",
    nameEn: "Acute Febrile Illness (Undifferentiated Pyrexia)",
    nameHi: "तीव्र बुखार (सामान्य ज्वर)",
    department: "General OPD / ASHA Triaging",
    facilityTier: "Village Sub-Center / PHC",
    triageLevel: "ROUTINE",
    isEmergency: false,
    triggers: [
      "bukhar", "fever", "taap", "tap", "garam", "temper", "garmi", "sar garam",
      "बुखार", "ताप", "तप रहा है"
    ],
    explanationEn: "Acute onset fever can arise from early viral flu, seasonal infections, or developing localized infections. Monitoring accompanying symptoms over 24-48 hours is key.",
    explanationHi: "बुखार शरीर में संक्रमण से लड़ने की स्वाभाविक प्रतिक्रिया है। यदि इसके साथ ठंड, उल्टी या बदन दर्द जैसे लक्षण जुड़ते हैं तो विशेष जांच जरूरी होती है।",
    tests: [
      "Clinical Thermometer temperature logging (Morning & Evening)",
      "Complete Blood Count (CBC) if fever persists > 3 days",
      "Urine Routine Examination"
    ],
    firstAid: [
      "Jan Aushadhi Paracetamol 500mg: 1 tablet after food if temperature exceeds 100°F (Max 3-4 times daily).",
      "Hydration: Drink warm boiled water, herbal tea, or coconut water.",
      "Sponge forehead and body with lukewarm or normal water if fever is high. Do not use ice water."
    ],
    redFlags: [
      "Fever with severe shivering/chills (Suspected Malaria)",
      "High fever lasting more than 3 consecutive days",
      "Fever accompanied by stiff neck, rash, or breathlessness"
    ],
    quickReplies: ["मुझे ठंड भी लग रही है", "3 दिन से बुखार है", "सिर दर्द और उल्टी है"]
  }
];

export class RuralTriageEngine {
  private accumulatedSymptoms: Set<string> = new Set();
  private conversationHistory: Array<{ role: "user" | "assistant"; text: string }> = [];

  /**
   * Reset engine state for a new session
   */
  public reset(): void {
    this.accumulatedSymptoms.clear();
    this.conversationHistory = [];
  }

  /**
   * Normalize user input (handles phonetic Hinglish, Devanagari, and English)
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[\.,\?!;:_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Evaluates user message against cumulative symptom memory
   */
  public evaluate(userMessage: string): TriageResult {
    const norm = this.normalizeText(userMessage);

    // Save user message in conversation history
    this.conversationHistory.push({ role: "user", text: userMessage });

    // Extract newly discovered symptoms from this turn and add to accumulated set
    const currentTurnTokens = norm.split(" ");
    currentTurnTokens.forEach((t) => this.accumulatedSymptoms.add(t));
    this.accumulatedSymptoms.add(norm);

    const cumulativeText = Array.from(this.accumulatedSymptoms).join(" ");

    // 1. Evaluate Against Disease Rules Matrix
    let bestMatch: DiseaseRule | null = null;
    let highestScore = 0;
    const detectedTriggers: string[] = [];

    for (const rule of RURAL_DISEASE_RULES) {
      let score = 0;
      let ruleTriggersMatched = 0;

      // Check keyword groups if defined (e.g. Fever AND Chills)
      if (rule.requiredKeywords && rule.requiredKeywords.length > 0) {
        let allGroupsSatisfied = true;
        for (const group of rule.requiredKeywords) {
          const groupMatch = group.some((kw) => cumulativeText.includes(kw));
          if (!groupMatch) {
            allGroupsSatisfied = false;
            break;
          }
        }
        if (allGroupsSatisfied) {
          score += 50; // Major boost for compound symptom combinations (Fever + Chills)
        }
      }

      // Check individual triggers
      for (const trigger of rule.triggers) {
        if (cumulativeText.includes(trigger)) {
          score += 15;
          ruleTriggersMatched++;
          if (!detectedTriggers.includes(trigger)) {
            detectedTriggers.push(trigger);
          }
        }
      }

      // If this rule scored higher than previous, select it
      if (score > highestScore && (ruleTriggersMatched > 0 || score >= 50)) {
        highestScore = score;
        bestMatch = rule;
      }
    }

    // Default fallback if no specific rural condition matched
    if (!bestMatch) {
      bestMatch = {
        id: "general_checkup",
        nameEn: "General Health Consultation & Primary Triage",
        nameHi: "सामान्य प्राथमिक स्वास्थ्य परामर्श",
        department: "General OPD",
        facilityTier: "Ayushman Arogya Mandir / Village Sub-Center",
        triageLevel: "ROUTINE",
        isEmergency: false,
        triggers: [],
        explanationEn: `I have noted your reported symptoms: "${userMessage}". In rural primary health centers, this should be evaluated by your village ASHA worker or Community Health Officer (CHO) at the nearest Ayushman Arogya Mandir.`,
        explanationHi: `मैंने आपके बताए लक्षण दर्ज कर लिए हैं: "${userMessage}"। कृपया अपने गांव की आशा दीदी (ASHA) या नजदीकी आयुष्मान आरोग्य मंदिर में कम्युनिटी हेल्थ ऑफिसर (CHO) से परामर्श लें।`,
        tests: ["Basic Vitals Check (BP, Pulse, Temperature, SpO2)", "Random Blood Sugar"],
        firstAid: [
          "Take light, home-cooked digestible food (daal-rice, khichdi).",
          "Ensure adequate fluid and water intake.",
          "Visit the Sub-Center on OPD days for free physician review."
        ],
        redFlags: [
          "Sudden high fever with shivering or seizures",
          "Difficulty breathing or blue discoloration",
          "Severe vomiting or continuous loose motions"
        ],
        quickReplies: ["मुझे बुखार है", "पेट में दर्द है", "खांसी और जुकाम है"]
      };
    }

    const confidence = Math.min(0.95, Math.max(0.70, (highestScore / 80)));

    const result: TriageResult = {
      suspectedCondition: bestMatch.nameEn,
      conditionHindi: bestMatch.nameHi,
      confidenceScore: Math.round(confidence * 100) / 100,
      triageLevel: bestMatch.triageLevel,
      department: bestMatch.department,
      facilityTier: bestMatch.facilityTier,
      detectedSymptoms: detectedTriggers.slice(0, 5),
      explanationEnglish: bestMatch.explanationEn,
      explanationHindi: bestMatch.explanationHi,
      recommendedTests: bestMatch.tests,
      safeFirstAid: bestMatch.firstAid,
      redFlags: bestMatch.redFlags,
      quickReplies: bestMatch.quickReplies,
      isEmergency: bestMatch.isEmergency
    };

    return result;
  }
}

// Global Singleton Instance
export const ruralTriageEngine = new RuralTriageEngine();
