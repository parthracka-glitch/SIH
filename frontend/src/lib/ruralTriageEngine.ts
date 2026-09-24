/**
 * Arogya Mitra — Rural Clinical NLP Triage Engine & Diagnostic Knowledge Base
 * Specially trained for Indian rural/tribal primary healthcare patterns and AYUSH/Home Remedies.
 * Supports: Hinglish, Devanagari Hindi, Marathi, and English.
 */

export interface TriageResult {
  suspectedCondition: string;
  conditionHindi: string;
  conditionMarathi?: string;
  confidenceScore: number;
  triageLevel: "ROUTINE" | "MODERATE" | "URGENT" | "CRITICAL_108";
  department: string;
  facilityTier: string;
  detectedSymptoms: string[];
  explanationHindi: string;
  explanationEnglish: string;
  explanationMarathi?: string;
  homeRemediesHindi: string[];
  homeRemediesEnglish: string[];
  homeRemediesMarathi?: string[];
  safeFirstAid: string[];
  redFlags: string[];
  dietAdvice: string[];
  quickReplies: string[];
  isEmergency: boolean;
  formattedReply: string;
}

export interface DiseaseRule {
  id: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  department: string;
  facilityTier: string;
  triageLevel: "ROUTINE" | "MODERATE" | "URGENT" | "CRITICAL_108";
  isEmergency: boolean;
  triggers: string[];
  requiredKeywords?: string[][]; // Multi-group compound triggers e.g. [[fever], [diarrhea]]
  priorityScore?: number;
  explanationEn: string;
  explanationHi: string;
  explanationMr: string;
  homeRemediesEn: string[];
  homeRemediesHi: string[];
  homeRemediesMr: string[];
  safeFirstAid: string[];
  redFlags: string[];
  dietAdvice: string[];
  quickReplies: string[];
}

export const RURAL_DISEASE_RULES: DiseaseRule[] = [
  // 1. Compound: Fever + Loose Motions / Diarrhea (Gastroenteritis / Enteric Infection)
  {
    id: "fever_and_diarrhea",
    nameEn: "Acute Gastroenteritis / Enteric Infection (Fever with Loose Motions)",
    nameHi: "आंतों का संक्रमण / बुखार के साथ दस्त (Gastroenteritis)",
    nameMr: "पोटाचा संसर्ग / तापासोबत जुलाब",
    department: "General Medicine / Pediatrics",
    facilityTier: "Ayushman Arogya Mandir / PHC",
    triageLevel: "URGENT",
    isEmergency: false,
    priorityScore: 90,
    triggers: [
      "fever diarrhea", "bukhar dast", "bukhar aur loose motion", "taap aani julab", "loosemotions bhi"
    ],
    requiredKeywords: [
      ["bukhar", "fever", "taap", "tap", "garam", "ताप", "बुखार"],
      ["dast", "loose motion", "loosemotion", "loosemotions", "diarrhea", "patle dast", "ulti", "vomiting", "जुलाब", "दस्त"]
    ],
    explanationEn: "Fever combined with loose motions points towards an active bacterial or viral gastrointestinal infection (Food poisoning or Enteric infection). Preventing rapid dehydration and electrolyte loss is the critical priority.",
    explanationHi: "बुखार के साथ पतले दस्त होना पेट या आंतों में बैक्टीरिया/वायरल संक्रमण का संकेत है। इस स्थिति में शरीर में पानी और नमक की कमी (डिहाइड्रेशन) को रोकना सबसे ज्यादा जरूरी है।",
    explanationMr: "तापासोबत जुलाब होणे हे पोटातील किंवा आतड्यातील संसर्गाचे लक्षण आहे. शरीरातील पाण्याची कमतरता (डिहायड्रेशन) रोखणे अत्यंत आवश्यक आहे.",
    homeRemediesEn: [
      "Homemade WHO ORS: Dissolve 6 teaspoons sugar + 1/2 teaspoon salt in 1 liter clean boiled water. Sip after every loose stool.",
      "Rice Water (चावल का मांड / Kanji) with a pinch of rock salt and roasted cumin.",
      "Curd/Buttermilk (दही/छाछ) mixed with roasted jeera (cumin) powder - acts as a natural probiotic.",
      "Ripe Banana & boiled mashed potatoes to restore potassium.",
      "Lukewarm water sponging on forehead for fever relief (do NOT use cold ice water)."
    ],
    homeRemediesHi: [
      "घरेलू ORS घोल: 1 लीटर उबले व ठंडे पानी में 6 चम्मच चीनी और आधा चम्मच नमक मिलाएं। हर बार दस्त के बाद 1 गिलास घूंट-घूंट पिएं।",
      "चावल का मांड (Rice Water): उबले चावल का पानी थोड़ा नमक व भुना जीरा डालकर पिएं, यह दस्त रोकने में तुरंत मदद करता है।",
      "दही या ताजी छाछ: इसमें भुना हुआ जीरा और काला नमक डालकर लें, यह आंतों के अच्छे बैक्टीरिया को बढ़ाता है।",
      "पका हुआ केला और उबले आलू: शरीर में पोटेशियम और ऊर्जा की कमी दूर करते हैं।",
      "बुखार के लिए ताजे पानी की पट्टी: माथे और हाथ-पैरों पर गीले सूती कपड़े की पट्टी रखें।"
    ],
    homeRemediesMr: [
      "घरगुती ओआरएस द्रावण: १ लिटर उकळलेल्या पाण्यात ६ चमचे साखर आणि अर्धा चमचा मीठ मिसळून थोडे-थोडे प्यावे.",
      "तांदळाची पेज (चावल का मांड): थोडे मीठ आणि भाजलेले जिरे टाकून प्यावी, यामुळे जुलाब लगेच नियंत्रणात येतात.",
      "ताजे ताक किंवा दही: भाजलेले जिरे आणि काळे मीठ टाकून घ्यावे.",
      "पिकलेली केळी आणि उकडलेला बटाटा खावा.",
      "तापासाठी कपाळावर ताज्या पाण्याच्या पट्ट्या ठेवाव्यात."
    ],
    safeFirstAid: [
      "Jan Aushadhi Zinc Sulfate 20mg once daily for 14 days.",
      "Jan Aushadhi Paracetamol 500mg (only if temperature > 100°F after food).",
      "Do NOT take strong anti-motility pills (like Loperamide) without doctor consultation as they trap infection."
    ],
    redFlags: [
      "Blood or black color in stools (Dysentery alert)",
      "High continuous fever (> 102°F) with delirium or shivering",
      "Sunken eyes, extreme thirst, no urine for over 6 hours"
    ],
    dietAdvice: [
      "Eat light Moong Dal Khichdi, curd-rice, and boiled bottle gourd (Lauki).",
      "Strictly avoid spicy, oily food, raw milk, tea, coffee, and outside cut fruits."
    ],
    quickReplies: ["ORS का घोल कैसे बनाएं?", "उल्टी भी हो रही है", "आशा दीदी से संपर्क करें"]
  },

  // 2. Loose Motions / Diarrhea alone (Dast / Julab)
  {
    id: "diarrhea",
    nameEn: "Acute Diarrhea / Loose Motions (Dehydration Risk)",
    nameHi: "पतले दस्त / डायरिया (दस्त की समस्या)",
    nameMr: "जुलाब / अतिसार (पाणी कमी होण्याचा धोका)",
    department: "General Medicine / Primary Care",
    facilityTier: "Village Sub-Center / PHC ORS Corner",
    triageLevel: "MODERATE",
    isEmergency: false,
    priorityScore: 75,
    triggers: [
      "dast", "patle dast", "loose motion", "loosemotion", "loosemotions", "diarrhea", "pet kharab",
      "pani jaisa dast", "marod", "julab", "जुलाब", "दस्त", "पतले दस्त", "उल्टी दस्त"
    ],
    explanationEn: "Frequent loose, watery bowel movements lead to rapid depletion of electrolytes and water. Prompt oral rehydration prevents severe dehydration.",
    explanationHi: "बार-बार पतले दस्त होने से शरीर से पानी और आवश्यक लवण (इलेक्ट्रोलाइट्स) तेजी से निकल जाते हैं। समय पर ओआरएस और घरेलू तरल पदार्थ लेने से तुरंत आराम मिलता है।",
    explanationMr: "वारंवार पातळ जुलाब झाल्याने शरीरातील पाणी आणि क्षार कमी होतात. वेळेवर ओआरएस घेतल्यास डिहायड्रेशन टळते.",
    homeRemediesEn: [
      "WHO ORS Packet: Dissolve 1 sachet in 1 liter clean drinking water; drink throughout the day.",
      "Home ORS Recipe: 1 Liter boiled water + 6 teaspoons Sugar + 1/2 teaspoon Salt.",
      "Pomegranate Juice (अनार का रस) or boiled Apple - natural astringent that firms stool.",
      "Curd Rice (दही-भात) with a pinch of roasted cumin and rock salt.",
      "Coconut Water (नारियल पानी) to replenish potassium."
    ],
    homeRemediesHi: [
      "ORS (ओआरएस का घोल): 1 पैकेट 1 लीटर साफ उबले पानी में घोलें और हर दस्त के बाद थोड़ा-थोड़ा पिएं।",
      "घर पर ओआरएस: 1 लीटर पानी में 6 चम्मच चीनी + आधा चम्मच नमक मिलाकर तैयार करें।",
      "अनार का रस या उबला सेब: यह आंतों की सूजन कम करके दस्त को गाढ़ा करने में मदद करता है।",
      "दही-चावल (Curd Rice): भुने जीरे के साथ लें, यह पेट को ठंडक और अच्छे बैक्टीरिया देता है।",
      "नारियल पानी और नींबू-पानी: शरीर में इलेक्ट्रोलाइट संतुलन बनाए रखते हैं।"
    ],
    homeRemediesMr: [
      "ओआरएस पाणी: १ पाकीट १ लिटर स्वच्छ पाण्यात मिसळून दिवसभर थोडे-थोडे प्यावे.",
      "डाळिंबाचा रस किंवा सफरचंद खावे.",
      "दही-भात जिरे पूड टाकून खावा.",
      "नारळ पाणी आणि लिंबू पाणी प्यावे."
    ],
    safeFirstAid: [
      "Jan Aushadhi Zinc Sulfate (20mg daily for 14 days) to rebuild gut lining.",
      "Avoid milk, oily puris, fried snacks, and caffeine.",
      "Wash hands thoroughly with soap before eating and after using the toilet."
    ],
    redFlags: [
      "No urination for 6+ hours or very dark concentrated urine",
      "Blood or pus in stools",
      "Severe abdominal cramps and continuous vomiting"
    ],
    dietAdvice: [
      "Light Khichdi, Banana, boiled potato, sago (Sabudana) porridge.",
      "Strictly avoid chillies, roadside street food, and sodas."
    ],
    quickReplies: ["ORS का पैकेट कहां मिलेगा?", "पेट में मरोड़ भी है", "बच्चे को दस्त है"]
  },

  // 3. Fever alone (Viral Pyrexia / Bukhar / Taap)
  {
    id: "acute_fever",
    nameEn: "Acute Fever / Viral Pyrexia (बुखार / ताप)",
    nameHi: "वायरल बुखार / सामान्य ज्वर",
    nameMr: "व्हायरल ताप / अंगात उष्णता",
    department: "General Medicine / Primary OPD",
    facilityTier: "Village Sub-Center / PHC",
    triageLevel: "ROUTINE",
    isEmergency: false,
    priorityScore: 70,
    triggers: [
      "bukhar", "fever", "taap", "tap", "garam sar", "body warm", "temper", "tap ahe",
      "sar garam", "badan garam", "ताप", "बुखार", "ज्वर"
    ],
    explanationEn: "Fever is your body's immune system fighting an infection. Most seasonal viral fevers resolve in 3-5 days with proper rest, hydration, and safe temperature control.",
    explanationHi: "बुखार शरीर की रोग प्रतिरोधक क्षमता (इम्यून सिस्टम) की संक्रमण से लड़ने की स्वाभाविक प्रक्रिया है। पर्याप्त आराम, तरल पदार्थों और घरेलू उपचार से यह 3-5 दिनों में ठीक हो जाता है।",
    explanationMr: "ताप हा संसर्गाशी लढण्याचा शरीराचा नैसर्गिक मार्ग आहे. विश्रांती, भरपूर पाणी आणि घरगुती उपायांनी ताप नियंत्रणात राहतो.",
    homeRemediesEn: [
      "Tulsi-Ginger Kadha: Boil 10-12 Tulsi leaves + 1 inch crushed ginger + 2-3 black peppercorns in 2 cups water until reduced to 1 cup. Drink warm with 1/2 tsp honey.",
      "Lukewarm Water Sponge: Wipe forehead, neck, and underarms with a soft cloth dipped in normal/lukewarm water (reduces body heat safely).",
      "Giloy (Guduchi) Decoction: Boil Giloy stem in water (known as Amrita for immunity & fever reduction).",
      "Hydration: Drink plenty of warm water, coconut water, or fresh pomegranate juice.",
      "Rest: Complete physical rest in a cool, well-ventilated room."
    ],
    homeRemediesHi: [
      "तुलसी-अदरक का काढ़ा: 10-12 तुलसी के पत्ते, 1 टुकड़ा कुटा अदरक और 3-4 काली मिर्च 2 कप पानी में उबालें। जब आधा कप रह जाए तो गुनगुना पिएं।",
      "माथे पर पानी की पट्टी: सादे या हल्के गुनगुने पानी में सूती कपड़ा भिगोकर माथे, गर्दन और हाथों पर रखें। बर्फ का पानी न लगाएं।",
      "गिलोय का काढ़ा: गिलोय की डंडी या गिलोय रस का सेवन शरीर की रोग प्रतिरोधक क्षमता बढ़ाता है और बुखार उतारता है।",
      "भरपूर तरल पदार्थ: गुनगुना पानी, नारियल पानी और पतली मूंग दाल का सूप पिएं।",
      "हल्का आहार: मूंग दाल की खिचड़ी, दलिया या सूप लें। भारी व तला-भुना खाना न खाएं।"
    ],
    homeRemediesMr: [
      "तुळस-आले काढा: तुळशीची पाने, आले आणि काळी मिरी पाण्यात उकळून कोमट काढा प्यावा.",
      "कपाळावर पाण्याच्या पट्ट्या: साध्या पाण्याच्या ओल्या पट्ट्या कपाळावर ठेवाव्यात.",
      "गुळवेल (गिलोय) काढा: रोगप्रतिकारशक्ती वाढवण्यासाठी गुळवेलीचा काढा घ्यावा.",
      "भरपूर कोमट पाणी, नारळ पाणी आणि मुगाच्या डाळीचे सूप प्यावे."
    ],
    safeFirstAid: [
      "Jan Aushadhi Paracetamol 500mg: 1 tablet after food if temperature crosses 100°F (Max 3-4 times in 24 hours).",
      "Avoid taking Brufen / Combiflam without doctor review (especially during dengue/monsoon season).",
      "Record temperature morning and evening with a thermometer."
    ],
    redFlags: [
      "Fever > 102°F lasting more than 3 continuous days",
      "Severe shivering / chills (Malaria alert)",
      "Rash, stiff neck, or severe breathing trouble"
    ],
    dietAdvice: [
      "Warm Moong Dal Khichdi, clear vegetable soup, boiled water with tulsi.",
      "Avoid cold water, curd at night, heavy fried snacks, and oily curries."
    ],
    quickReplies: ["ठंड और कपकपी भी है", "सिर दर्द भी हो रहा है", "दवा कौन सी लूं?"]
  },

  // 4. Malaria (Fever + Shivering / Chills)
  {
    id: "malaria",
    nameEn: "Suspected Malaria (Fever with Rigors/Chills)",
    nameHi: "संभावित मलेरिया (ठंड व कपकपी वाला बुखार)",
    nameMr: "मलेरिया (थंडी वाजून येणारा ताप)",
    department: "General Medicine / Vector Borne Disease",
    facilityTier: "Ayushman Arogya Mandir / PHC (Free RDT Test)",
    triageLevel: "URGENT",
    isEmergency: false,
    priorityScore: 85,
    triggers: [
      "malaria", "thand", "thandi", "kapkapi", "shivering", "chills", "rigor", "rigors", "sardi bukhar",
      "थंड", "कपकपी", "ठंडी", "कंप"
    ],
    requiredKeywords: [
      ["bukhar", "fever", "taap", "tap", "ताप", "बुखार"],
      ["thand", "thandi", "kapkapi", "shivering", "chills", "rigor", "थंड", "कपकपी"]
    ],
    explanationEn: "Cycles of high fever accompanied by intense shivering and sweating are typical signs of Malaria transmitted by Anopheles mosquitoes. Free rapid blood slide testing is available at all Sub-Centers.",
    explanationHi: "तेज बुखार के साथ भीषण ठंड और कंपकंपी लगना मलेरिया का प्रमुख लक्षण है। यह मच्छर के काटने से फैलता है। प्राथमिक स्वास्थ्य केंद्र (PHC) पर इसकी मुफ्त जांच उपलब्ध है।",
    explanationMr: "तीव्र तापासोबत थंडी वाजून येणे आणि घाम येणे हे मलेरियाचे लक्षण आहे. सरकारी दवाखान्यात याची मोफत तपासणी होते.",
    homeRemediesEn: [
      "Keep patient warm during the shivering chill stage with warm blankets.",
      "Once the hot fever stage starts, remove extra blankets and apply lukewarm water cloths to forehead.",
      "Giloy & Tulsi Decoction: Drink twice daily to support platelet levels and immunity.",
      "Fresh Pomegranate Juice & Coconut Water to maintain hydration.",
      "Use mosquito nets (LLIN) to prevent transmission to other family members."
    ],
    homeRemediesHi: [
      "जब ठंड लगे: मरीज को चादर या कंबल ओढ़ाएं और गुनगुना पानी पिलाएं।",
      "जब तेज बुखार चढ़े: कंबल हटा दें और माथे व पैरों पर सादे पानी की पट्टी रखें।",
      "गिलोय और तुलसी का काढ़ा: दिन में 2 बार पिएं, यह खून को साफ करने और कमजोरी दूर करने में सहायक है।",
      "नारियल पानी और अनार का रस: डिहाइड्रेशन दूर रखने के लिए बार-बार घूंट-घूंट पिलाएं।",
      "मच्छरदानी का इस्तेमाल करें ताकि परिवार के अन्य सदस्यों को मच्छर न काटें।"
    ],
    homeRemediesMr: [
      "थंडी वाजत असताना पांघरूण द्यावे व कोमट पाणी प्यायला द्यावे.",
      "ताप चढल्यावर कपाळावर पाण्याच्या पट्ट्या ठेवाव्यात.",
      "गुळवेल व तुळशीचा काढा दिवसातून दोनदा घ्यावा.",
      "नारळ पाणी आणि डाळिंबाचा रस भरपूर प्यावा."
    ],
    safeFirstAid: [
      "Visit nearest Ayushman Arogya Mandir / PHC for FREE Malaria Rapid Diagnostic Test (RDT).",
      "Jan Aushadhi Paracetamol 500mg for fever control.",
      "Take full course of prescribed anti-malarial medicine (Chloroquine/ACT) if test is positive."
    ],
    redFlags: [
      "Excessive drowsiness, confusion, or talking irrationally (Cerebral Malaria risk)",
      "Yellowing of eyes or very dark cola-colored urine",
      "Continuous vomiting unable to retain liquids"
    ],
    dietAdvice: [
      "Soft boiled rice with moong dal, light vegetable soup, boiled eggs, sweet fruits.",
      "Avoid oily, deep-fried food, alcohol, and stale food."
    ],
    quickReplies: ["खून की जांच कहां होगी?", "प्लेटलेट कैसे बढ़ाएं?", "आशा दीदी का नंबर दें"]
  },

  // 5. Cough, Cold, & Sore Throat (Khansi / Zukam / Gale me Kharaash)
  {
    id: "cough_cold",
    nameEn: "Viral Upper Respiratory Infection / Cough & Cold",
    nameHi: "खांसी, जुकाम और गले में खराश (सर्दी-जुकाम)",
    nameMr: "खोकला, सर्दी आणि घशात खवखव",
    department: "General Medicine / ENT",
    facilityTier: "Ayushman Arogya Mandir / Sub-Center",
    triageLevel: "ROUTINE",
    isEmergency: false,
    priorityScore: 70,
    triggers: [
      "khansi", "jukam", "zukam", "cough", "cold", "balgam", "sardi", "gale me dard", "sore throat",
      "chheenk", "khansi balgam", "gala kharab", "kharaash", "खोकला", "सर्दी", "खांसी", "जुकाम", "कफ"
    ],
    explanationEn: "Common viral infections irritate the throat lining and bronchial passages, causing mucus, sneezing, and coughing. Traditional soothing remedies effectively loosen congestion.",
    explanationHi: "मौसम बदलने पर वायरल संक्रमण से गले में खराश, नाक बहना और खांसी की समस्या होती है। घरेलू भाप और काढ़े से कफ पिघलकर बाहर निकलता है और गले को तुरंत राहत मिलती है।",
    explanationMr: "हवामान बदलामुळे होणाऱ्या सर्दी-खोकल्यात घरगुती वाफ आणि काढ्यामुळे घशाला लगेच आराम मिळतो.",
    homeRemediesEn: [
      "Ginger-Honey-Black Pepper Elixir: Mix 1 tsp fresh ginger juice + 1 tsp pure honey + pinch of black pepper. Take 2-3 times daily (do not drink water for 20 mins after).",
      "Golden Turmeric Milk (हल्दी वाला दूध): 1 glass warm milk with 1/2 tsp pure turmeric and a pinch of black pepper at bedtime.",
      "Warm Salt Water Gargle: 1 glass warm water with 1/2 tsp rock salt and a pinch of turmeric. Gargle 3 times a day for sore throat.",
      "Steam Inhalation (भाप लेना): Inhale steam with carom seeds (Ajwain) or eucalyptus leaves for 5-10 minutes to open blocked chest.",
      "Mulethi (Licorice) / Clove: Chew a small piece of Mulethi or suck on a clove for dry hacking cough."
    ],
    homeRemediesHi: [
      "अदरक और शहद का रस: 1 चम्मच अदरक का ताजा रस + 1 चम्मच शहद + चुटकी भर काली मिर्च मिलाकर दिन में 2-3 बार चाटें (इसके 20 मिनट बाद तक पानी न पिएं)।",
      "हल्दी वाला गुनगुना दूध: रात को सोने से पहले आधा चम्मच हल्दी और चुटकी भर काली मिर्च डालकर पिएं, यह फेफड़ों की सूजन कम करता है।",
      "गुनगुने नमक के पानी से गरारे: 1 गिलास गर्म पानी में आधा चम्मच नमक डालकर दिन में 3 बार गरारे करें।",
      "अजवाइन की भाप (Steam): गर्म पानी में आधा चम्मच अजवाइन डालकर तौलिए से ढककर 10 मिनट भाप लें, इससे छाती का कफ पिघलता है।",
      "मुलेठी या लौंग: गले में खराश और सूखी खांसी में एक लौंग या मुलेठी का टुकड़ा मुंह में रखकर चूसें।"
    ],
    homeRemediesMr: [
      "आले आणि मध: १ चमचा आल्याचा रस + १ चमचा मध दिवसातून २-३ वेळा घ्यावे.",
      "हळदीचे कोमट दूध: रात्री झोपताना हळद टाकून दूध प्यावे.",
      "मिठाच्या कोमट पाण्याच्या गुळण्या: घशातील खवखव कमी करण्यासाठी दिवसातून ३ वेळा गुळण्या कराव्यात.",
      "ओव्याची वाफ: गरम पाण्यात ओवा टाकून वाफ घ्यावी.",
      "ज्येष्ठमध किंवा लवंग तोंडात धरून चोखावी."
    ],
    safeFirstAid: [
      "Jan Aushadhi Cetirizine 10mg (1 tablet at night if heavy runny nose/sneezing).",
      "Jan Aushadhi Paracetamol 500mg if mild fever or headache accompanies cold.",
      "Stay well hydrated with warm water and herbal tea."
    ],
    redFlags: [
      "Cough lasting more than 2 weeks (Screen for Tuberculosis / TB)",
      "Blood in sputum (Hemoptysis)",
      "Severe wheezing, breathlessness, or chest congestion"
    ],
    dietAdvice: [
      "Drink warm water only. Eat hot vegetable/tomato soup with pepper, dal-rice with garlic.",
      "Avoid refrigerated water, ice cream, curd, cold bananas, and oily fried snacks."
    ],
    quickReplies: ["गले में बहुत दर्द है", "खांसी 2 हफ्ते से है", "कफ कैसे निकालें?"]
  },

  // 6. Acidity / Heartburn / Gas / Indigestion (Pet me jalan / Badhazmi)
  {
    id: "acidity",
    nameEn: "Gastroesophageal Reflux (GERD) / Acidity & Indigestion",
    nameHi: "एसिडिटी, गैस, खट्टी डकार और सीने में जलन",
    nameMr: "पित्त, ॲसिडिटी, गॅस आणि छातीत जळजळ",
    department: "General Medicine / Gastroenterology",
    facilityTier: "Ayushman Arogya Mandir / PHC",
    triageLevel: "ROUTINE",
    isEmergency: false,
    priorityScore: 65,
    triggers: [
      "acidity", "gas", "pet me gas", "jalan", "badhazmi", "indigestion", "seene me jalan", "bloating",
      "khatti dakar", "khatta pani", "pet phoolna", "pitt", "पित्त", "गैस", "एसिडिटी", "जलन", "बदहजमी"
    ],
    explanationEn: "Excess stomach acid flowing back into the esophagus causes upper burning, sour burps, and stomach heaviness. Simple cooling kitchen spices neutralize acid quickly.",
    explanationHi: "पेट में जरूरत से ज्यादा एसिड बनने और ऊपर आने से सीने में जलन, खट्टी डकारें और पेट में भारीपन होता है। घरेलू शीतल औषधियों से एसिड तुरंत शांत होता है।",
    explanationMr: "पोटात पित्त वाढल्यामुळे छातीत जळजळ आणि आंबट ढेकर येतात. घरगुती उपायांनी पित्त लगेच शांत होते.",
    homeRemediesEn: [
      "Ajwain & Black Salt: Chew 1/2 tsp carom seeds (Ajwain) with a pinch of rock salt and swallow with warm water for instant gas relief.",
      "Jeera-Saunf Water: Boil 1 tsp cumin (Jeera) + 1 tsp fennel seeds (Saunf) in 2 cups water. Drink warm after heavy meals.",
      "Cold Milk: Sip 1/2 glass of cold milk (without sugar) for instant neutralization of chest burning.",
      "Fresh Buttermilk (छाछ) with roasted cumin powder and mint leaves.",
      "Jaggery (गुड़): Suck on a small piece of natural jaggery after food to stimulate healthy digestive enzymes."
    ],
    homeRemediesHi: [
      "अजवाइन और काला नमक: आधा चम्मच अजवाइन में चुटकी भर काला नमक मिलाकर चबाएं और गुनगुना पानी पिएं। गैस व पेट दर्द में तुरंत राहत मिलती है।",
      "जीरा और सौंफ का पानी: 1 चम्मच जीरा और 1 चम्मच सौंफ 2 गिलास पानी में उबालें। इसे भोजन के बाद गुनगुना पिएं, यह एसिडिटी खत्म करता है।",
      "ठंडा दूध: सीने में तेज जलन होने पर आधा गिलास सादा ठंडा दूध (बिना चीनी) घूंट-घूंट पिएं, यह एसिड को तुरंत शांत करता है।",
      "ताजी छाछ (मट्ठा): भुना जीरा और पुदीना मिलाकर पिएं।",
      "खाना खाने के तुरंत बाद न लेटें और रात का खाना सोने से 2 घंटे पहले खाएं।"
    ],
    homeRemediesMr: [
      "ओवा आणि काळे मीठ: अर्धा चमचा ओवा काळ्या मिठासोबत चावून कोमट पाणी प्यावे.",
      "जिरे आणि बडीशेपचे पाणी: जेवणानंतर जिरे-बडीशेप उकळलेले पाणी प्यावे.",
      "थंड दूध: छातीत जळजळ होत असल्यास अर्धा ग्लास थंड दूध प्यावे.",
      "ताजे ताक जिरेपूड टाकून प्यावे.",
      "जेवल्याबरोबर लगेच झोपू नये."
    ],
    safeFirstAid: [
      "Jan Aushadhi Pantoprazole 40mg or Omeprazole 20mg (take empty stomach in morning).",
      "Antacid Gel (2 teaspoons after meals if intense burning).",
      "Avoid skipping meals and avoid empty-stomach tea/bidi/smoking."
    ],
    redFlags: [
      "Severe crushing chest pain radiating to left arm/jaw (Rule out Heart Attack / Cardiac emergency!)",
      "Vomiting black or coffee-ground material",
      "Difficulty or pain while swallowing food"
    ],
    dietAdvice: [
      "Eat smaller, frequent meals. Include bottle gourd, cucumber, watermelon, and coconut water.",
      "Strictly avoid red chillies, vinegar, deep-fried pakodas, samosas, and strong black tea."
    ],
    quickReplies: ["सीने में जलन हो रही है", "खट्टी डकारें आ रही हैं", "दवा कब लेनी है?"]
  },

  // 7. Headache / Sir Dard / Migraine
  {
    id: "headache",
    nameEn: "Tension Headache / Migraine / Sinusitis",
    nameHi: "सिर दर्द / माइग्रेन / आधासीसी का दर्द",
    nameMr: "डोकेदुखी / अर्धशिशी (मायग्रेन)",
    department: "General Medicine / Neurology",
    facilityTier: "Ayushman Arogya Mandir / PHC",
    triageLevel: "ROUTINE",
    isEmergency: false,
    priorityScore: 60,
    triggers: [
      "sir dard", "sar dard", "headache", "sir me dard", "sar ghoomna", "migraine", "adha sir",
      "matha dard", "kaphal", "डोकेदुखी", "माथा दुखना", "सिर दर्द", "आधा सीसी"
    ],
    explanationEn: "Headaches commonly stem from dehydration, eye strain, lack of sleep, sinus congestion, or stress. Hydration and acupressure provide rapid relief.",
    explanationHi: "सिर दर्द का मुख्य कारण पानी की कमी (डिहाइड्रेशन), धूप, तनाव, नींद पूरी न होना या आंखों पर जोर पड़ना होता है। घरेलू आराम और मालिश से इसमें जल्द राहत मिलती है।",
    explanationMr: "पाण्याची कमतरता, अपुरी झोप किंवा ताणामुळे डोकेदुखी होते. पुरेसे पाणी व विश्रांती घेतल्यास आराम पडतो.",
    homeRemediesEn: [
      "Drink 2 Full Glasses of Water: Dehydration is the #1 hidden cause of sudden daytime headaches.",
      "Ginger Paste on Forehead: Apply a thin paste of dry ginger powder (सोंठ) or fresh crushed ginger on forehead for 10-15 minutes.",
      "Acupressure Point LI-4 (Hegu): Press firmly on the webbed muscular area between your thumb and index finger for 2-3 minutes on both hands.",
      "Peppermint or Eucalyptus Oil: Gently massage temples, forehead, and back of the neck.",
      "Rest in a Dark, Quiet Room: Close eyes and practice slow deep belly breathing for 20 minutes."
    ],
    homeRemediesHi: [
      "2 गिलास ताजा पानी पिएं: अधिकांश सिर दर्द शरीर में पानी की कमी (डिहाइड्रेशन) से होते हैं।",
      "माथे पर सोंठ या अदरक का लेप: सोंठ पाउडर या ताजे अदरक का पेस्ट माथे पर लगाएं, यह नसों का तनाव खींच लेता है।",
      "हाथ का एक्यूप्रेशर प्वाइंट: अंगूठे और तर्जनी उंगली के बीच की खाली जगह (Hegu Point) को 2-3 मिनट दबाएं।",
      "नीलगिरी या पिपरमिंट तेल की मालिश: माथे और गर्दन के पिछले हिस्से पर हल्के हाथों से मालिश करें।",
      "शांत व अंधेरे कमरे में 20 मिनट आराम करें और गहरी सांसें लें।"
    ],
    homeRemediesMr: [
      "२ ग्लास पाणी प्यावे: शरीरात पाणी कमी असल्यामुळे डोके दुखू शकते.",
      "कपाळावर सुंठ किंवा आल्याचा लेप लावावा.",
      "अंगठा आणि तर्जनी यांच्यामधील भागावर (ॲक्युप्रेशर) हलका दाब द्यावा.",
      "शांत व अंधाऱ्या खोलीत थोडा वेळ विश्रांती घ्यावी."
    ],
    safeFirstAid: [
      "Jan Aushadhi Paracetamol 500mg (1 tablet after food).",
      "Get eyesight tested if headache occurs during reading or phone usage.",
      "Avoid excessive tea, coffee, and screen exposure in dark."
    ],
    redFlags: [
      "Sudden explosive 'thunderclap' headache (worst headache of life)",
      "Headache accompanied by stiff neck, high fever, or confusion",
      "Weakness/numbness on one side of face or body (Stroke warning)"
    ],
    dietAdvice: [
      "Hydrate with coconut water, lemonade with mint, and light meals.",
      "Avoid skipping meals and avoid fermented or stale leftover foods."
    ],
    quickReplies: ["चक्कर भी आ रहे हैं", "एक तरफ का सिर दुख रहा है", "आंखों में दर्द है"]
  },

  // 8. Joint Pain / Knee Pain / Arthritis / Gathiya (Sandhivata)
  {
    id: "joint_pain",
    nameEn: "Osteoarthritis / Rheumatism / Joint & Knee Pain",
    nameHi: "जोड़ों व घुटनों का दर्द / गठिया (संधिवात)",
    nameMr: "सांधेदुखी / गुडघेदुखी / संधिवात",
    department: "Orthopedics / AYUSH",
    facilityTier: "Ayushman Arogya Mandir / PHC",
    triageLevel: "MODERATE",
    isEmergency: false,
    priorityScore: 60,
    triggers: [
      "joint pain", "jodo me dard", "ghutna dard", "knee pain", "gathiya", "arthritis", "sandhivata",
      "kamar dard", "back pain", "kohni dard", "sandhiwat", "जोड़ों का दर्द", "घुटने में दर्द", "गठिया", "सांधेदुखी", "गुडघेदुखी"
    ],
    explanationEn: "Cartilage wear-and-tear and inflammatory changes lead to joint stiffness and pain during movement. Herbal anti-inflammatory oils and warm compresses restore mobility.",
    explanationHi: "उम्र बढ़ने, यूरिक एसिड बढ़ने या जोड़ों में चिकनाई कम होने से घुटनों और जोड़ों में दर्द व जकड़न होती है। लहसुन-सरसों तेल की मालिश और मेथी दाना इसमें बेहद लाभकारी हैं।",
    explanationMr: "वयानुसार सांध्यांमधील वंगण कमी झाल्याने किंवा वात वाढल्याने सांधेदुखी होते. घरगुती तेलाने मालिश केल्यास खूप फायदा होतो.",
    homeRemediesEn: [
      "Garlic-Mustard Oil Massage: Heat 4 crushed garlic cloves + 1/2 tsp Ajwain in 4 tablespoons mustard oil until dark. Massage warm oil on painful joints twice daily.",
      "Soaked Fenugreek (Methi) Seeds: Soak 1 tsp Methi seeds overnight in water. Chew the seeds and drink the water on an empty stomach in the morning.",
      "Turmeric & Dry Ginger Milk (सोंठ-हल्दी दूध): Drink warm milk with 1/2 tsp turmeric and 1/4 tsp dry ginger powder (natural anti-inflammatory).",
      "Hot Salt Compress (सिकाई): Tie rock salt in a cotton cloth, warm it gently on a tawa, and compress the aching knee/joint.",
      "Gentle Morning Knee Exercises: Non-weight bearing leg extensions and gentle walking."
    ],
    homeRemediesHi: [
      "लहसुन-अजवाइन का तेल: 4 कली लहसुन और आधा चम्मच अजवाइन सरसों के तेल में पकाएं। इस गुनगुने तेल से जोड़ों पर सुबह-शाम हल्के हाथों से मालिश करें।",
      "मेथी दाने का पानी: रात को 1 चम्मच मेथी दाना पानी में भिगोएं। सुबह खाली पेट मेथी चबाकर खाएं और पानी पिएं, यह जोड़ों का दर्द और वात खींचता है।",
      "सोंठ और हल्दी वाला दूध: रात को हल्दी और सोंठ पाउडर दूध में उबालकर पिएं, यह प्राकृतिक पेनकिलर का काम करता है।",
      "गर्म पोटली से सिकाई: कपड़े में मोटा नमक बांधकर तवे पर हल्का गर्म करें और घुटनों की सिकाई करें।",
      "ज्यादा देर पालथी मारकर नीचे बैठने से बचें और कुर्सी का इस्तेमाल करें।"
    ],
    homeRemediesMr: [
      "लसूण-मोहरीचे तेल: मोहरीच्या तेलात लसूण व ओवा गरम करून कोमट तेलाने सांध्यांवर मालिश करावी.",
      "मेथी दाण्याचे पाणी: रात्री मेथी पाण्यात भिजवून सकाळी दाणे चावून खावेत व पाणी प्यावे.",
      "हळद आणि सुंठीचे दूध रात्री प्यावे.",
      "गरम मिठाच्या पुरचुंडीने सांधे शेकावेत."
    ],
    safeFirstAid: [
      "Jan Aushadhi Paracetamol 650mg or Diclofenac Gel for topical application.",
      "Jan Aushadhi Calcium + Vitamin D3 supplements.",
      "Avoid heavy lifting and high-impact squatting."
    ],
    redFlags: [
      "Joint is severely swollen, hot to touch, bright red, with high fever (Septic arthritis)",
      "Complete inability to bear weight or sudden joint deformity",
      "Severe numbness in feet or legs"
    ],
    dietAdvice: [
      "Eat sesame seeds (तिल), walnuts, drumstick (सहजन/शेवगा), and green leafy vegetables.",
      "Avoid sour foods like curd at night, fermented batter, and excessive tomato/dal with high purines."
    ],
    quickReplies: ["कमर में भी दर्द है", "चलने में दिक्कत होती है", "सूजन कैसे कम करें?"]
  },

  // 9. Vomiting alone / Nausea (Ulti / Matli)
  {
    id: "vomiting",
    nameEn: "Acute Vomiting & Nausea / Emesis",
    nameHi: "उल्टी, मतली और जी मिचलाना",
    nameMr: "उलटी आणि मळमळ",
    department: "General Medicine / Primary Care",
    facilityTier: "Ayushman Arogya Mandir / PHC",
    triageLevel: "MODERATE",
    isEmergency: false,
    priorityScore: 70,
    triggers: [
      "ulti", "vomiting", "nausea", "ji machlana", "ulti jaisa", "chakkar ulti", "malmal",
      "उलटी", "मळमळ", "उल्टी", "मतली"
    ],
    explanationEn: "Stomach irritation, food intolerances, or motion sickness trigger the brain's vomiting reflex. Calming gastric nerves with mint and citrus relieves nausea quickly.",
    explanationHi: "पेट में संक्रमण, अपच या सफर की वजह से उल्टी और जी मिचलाने की समस्या होती है। नींबू, काला नमक और पुदीना पेट की नसों को तुरंत शांत करते हैं।",
    explanationMr: "अपचन किंवा संसर्गामुळे उलटी-मळमळ होते. लिंबू आणि पुदिन्यामुळे लगेच बरे वाटते.",
    homeRemediesEn: [
      "Lemon & Black Salt: Cut a fresh lemon in half, sprinkle black salt & roasted cumin, and slowly lick it.",
      "Mint (Pudina) & Ginger Juice: 1 tsp fresh mint juice + 1/2 tsp ginger juice + 1 tsp honey.",
      "Chew Clove (लौंग) or Green Cardamom (इलायची) slowly to curb nausea reflex.",
      "Sip cold coconut water or suck on small ice chips (do not drink large gulps of water at once)."
    ],
    homeRemediesHi: [
      "नींबू और काला नमक: आधे नींबू पर काला नमक और भुना जीरा लगाकर हल्का गर्म करें और धीरे-धीरे चाटें।",
      "पुदीना और अदरक का रस: 1 चम्मच पुदीने का रस, आधा चम्मच अदरक का रस और थोड़ा शहद मिलाकर लें।",
      "लौंग या हरी इलायची: मुंह में एक लौंग या इलायची रखकर धीरे-धीरे चूसें, इससे उल्टी की इच्छा बंद होती है।",
      "बर्फ का टुकड़ा या नारियल पानी: एक साथ खूब सारा पानी न पिएं, चम्मच-चम्मच ठंडा नारियल पानी या बर्फ चूसें।"
    ],
    homeRemediesMr: [
      "लिंबू आणि काळे मीठ चाटावे.",
      "पुदिन्याचा रस आणि आल्याचा रस मधासोबत घ्यावा.",
      "तोंडात लवंग किंवा वेलची धरून ठेवावी."
    ],
    safeFirstAid: [
      "Jan Aushadhi Ondansetron 4mg or Domperidone 10mg (only under medical advice).",
      "ORS sips to prevent dehydration.",
      "Do NOT eat solid food for 2-3 hours after vomiting."
    ],
    redFlags: [
      "Vomiting blood or dark black liquid",
      "Unable to keep any liquids down for more than 12 hours",
      "Accompanied by severe headache and neck stiffness"
    ],
    dietAdvice: [
      "Start with ice chips, then sips of ORS, clear apple juice, and thin rice water.",
      "Avoid milk, fatty/oily curries, and strong smells."
    ],
    quickReplies: ["दस्त भी हो रहे हैं", "चक्कर आ रहे हैं", "पानी भी नहीं पच रहा"]
  },

  // 10. High Blood Pressure / Hypertension (High BP)
  {
    id: "hypertension",
    nameEn: "Hypertension / High Blood Pressure Management",
    nameHi: "उच्च रक्तचाप (हाई ब्लड प्रेशर / बीपी)",
    nameMr: "उच्च रक्तदाब (हाय बीपी)",
    department: "General Medicine / NCD Clinic",
    facilityTier: "Ayushman Arogya Mandir / PHC NCD Clinic",
    triageLevel: "MODERATE",
    isEmergency: false,
    priorityScore: 75,
    triggers: [
      "high bp", "blood pressure", "bp", "sir ghoomna", "sir me dard peeche", "chakkar", "tention",
      "ghabrahat", "बीपी", "रक्तचाप", "सिर घूमना", "रक्तदाब"
    ],
    explanationEn: "Elevated arterial blood pressure strains the heart and blood vessels. Reducing dietary sodium and incorporating natural vasodilators helps maintain optimal pressure.",
    explanationHi: "रक्तचाप (BP) सामान्य से अधिक रहने पर दिल और नसों पर अत्यधिक दबाव पड़ता है। नमक कम करने, लहसुन खाने और नियमित जांच से इसे आसानी से नियंत्रित रखा जा सकता है।",
    explanationMr: "रक्तदाब वाढल्याने हृदयावर ताण येतो. मिठाचे प्रमाण कमी करणे आणि नियमित तपासणीने बीपी नियंत्रणात राहतो.",
    homeRemediesEn: [
      "Raw Garlic Clove: Chew 1-2 raw crushed garlic cloves with warm water on an empty stomach (allium naturally widens blood vessels).",
      "Strict Salt Reduction: Limit table salt to less than 1 level teaspoon per day. Eliminate pickles, papads, and processed namkeens.",
      "Arjuna Bark Decoction: Boil 1/2 tsp Arjuna bark powder in water/milk for cardiovascular support.",
      "Daily 30-Minute Brisk Walk & Anulom-Vilom Pranayama (deep alternate nostril breathing) to lower sympathetic tension.",
      "Drink Tender Coconut Water (rich in potassium)."
    ],
    homeRemediesHi: [
      "कच्चा लहसुन: सुबह खाली पेट 1-2 लहसुन की कली चबाकर गुनगुना पानी पिएं। लहसुन नसों को लचीला बनाता है और बीपी घटाता है।",
      "नमक कम करें: दिन भर में 1 छोटे चम्मच से कम नमक खाएं। पापड़, अचार, नमकीन और पैकेट वाले चिप्स पूरी तरह बंद करें।",
      "अर्जुन की छाल का काढ़ा: दिल की ताकत और बीपी कंट्रोल के लिए आधा चम्मच अर्जुन छाल पाउडर पानी में उबालकर पिएं।",
      "रोज 30 मिनट टहलें और 10 मिनट अनुलोम-विलोम प्राणायाम करें।",
      "तनाव और गुस्से से बचें, भरपूर 7-8 घंटे की नींद लें।"
    ],
    homeRemediesMr: [
      "सकाळी रिकाम्या पोटी १-२ लसूण पाकळ्या चावून कोमट पाणी प्यावे.",
      "आहारातील मिठाचे प्रमाण अगदी कमी करावे. पापड, लोणचे टाळावे.",
      "दररोज ३० मिनिटे फिरावे आणि अनुलोम-विलोम प्राणायाम करावा."
    ],
    safeFirstAid: [
      "Visit PHC or Ayushman Arogya Mandir for FREE digital BP check.",
      "Take prescribed Jan Aushadhi generic Telmisartan / Amlodipine regularly without skipping.",
      "Never stop BP medicines suddenly on your own."
    ],
    redFlags: [
      "BP reading systolic >= 180 or diastolic >= 110 mmHg (Hypertensive Crisis)",
      "Sudden weakness or drooping on one side of face/arm/leg (Stroke warning)",
      "Chest pain, blurring of vision, or shortness of breath"
    ],
    dietAdvice: [
      "Eat potassium-rich foods: Bananas, spinach (पालक), coconut water, bottle gourd.",
      "Strictly avoid smoking, bidi, alcohol, and deep-fried salty snacks."
    ],
    quickReplies: ["बीपी कितना होना चाहिए?", "नमक का विकल्प क्या है?", "मुफ्त दवा कहां मिलेगी?"]
  },

  // 11. Diabetes / High Blood Sugar (Madhumeha / Sugar)
  {
    id: "diabetes",
    nameEn: "Type 2 Diabetes Mellitus / High Blood Sugar Control",
    nameHi: "मधुमेह / हाई ब्लड शुगर (डायबिटीज की समस्या)",
    nameMr: "मधुमेह / रक्तातील साखर (डायबिटीज)",
    department: "General Medicine / NCD Clinic",
    facilityTier: "Ayushman Arogya Mandir / PHC NCD Clinic",
    triageLevel: "MODERATE",
    isEmergency: false,
    priorityScore: 75,
    triggers: [
      "sugar", "diabetes", "madhumeha", "blood sugar", "sugar badh gaya", "bar bar peshab",
      "pyas lagna", "मधुमेह", "शुगर", "डायबिटीज", "साखर वाढली"
    ],
    explanationEn: "Inability of insulin to regulate glucose causes elevated blood sugar, increased thirst, and frequent urination. Fiber-rich seeds and active lifestyle lower glucose levels naturally.",
    explanationHi: "शरीर में इंसुलिन का संतुलन बिगड़ने से खून में शुगर बढ़ जाती है। मेथी दाना, जामुन की गुठली और रोज टहलने से शुगर तेजी से सामान्य स्तर पर आती है।",
    explanationMr: "शरीरात इन्शुलिनचे प्रमाण असंतुलित झाल्याने साखर वाढते. मेथी दाणे, जांभूळ बी पावडर आणि व्यायामाने साखर नियंत्रणात राहते.",
    homeRemediesEn: [
      "Fenugreek (Methi) Seed Water: Soak 1 tablespoon Methi seeds in water overnight. Chew seeds and drink water in morning on empty stomach.",
      "Jamun Seed Powder: Take 1/2 teaspoon Jamun seed powder (जामुन गुठली चूर्ण) with warm water before meals.",
      "Bitter Gourd (Karela) & Amla Juice: Drink 30ml fresh Karela-Amla juice in morning.",
      "Cinnamon (दालचीनी) Powder: Add a pinch of cinnamon powder to warm water or tea to enhance insulin sensitivity.",
      "45 Minutes Daily Walking: Physical exercise directly helps muscles absorb excess blood glucose."
    ],
    homeRemediesHi: [
      "मेथी दाने का पानी: 1 चम्मच मेथी दाना रात भर पानी में भिगोएं। सुबह मेथी चबाएं और पानी पिएं। यह इंसुलिन की कार्यक्षमता बढ़ाता है।",
      "जामुन की गुठली का पाउडर: आधा चम्मच जामुन गुठली चूर्ण सुबह-शाम गुनगुने पानी से लें।",
      "करेला और आंवले का जूस: सुबह खाली पेट आधा कप करेला-आंवला जूस पिएं।",
      "दालचीनी पाउडर: गुनगुने पानी में चुटकी भर दालचीनी मिलाकर पिएं।",
      "रोज 45 मिनट तेज गति से टहलें। मीठा, गुड़, सफेद चावल और आलू कम करें।"
    ],
    homeRemediesMr: [
      "मेथी दाण्याचे पाणी: रात्री भिजवलेली मेथी सकाळी चावून खावी व पाणी प्यावे.",
      "जांभळाच्या बियांची पावडर कोमट पाण्यासोबत घ्यावी.",
      "कारले आणि आवळा रस सकाळी प्यावा.",
      "दररोज ४५ मिनिटे चालावे व गोड पदार्थ टाळावेत."
    ],
    safeFirstAid: [
      "Get FREE Fasting & Random Blood Sugar check at Ayushman Arogya Mandir.",
      "Take prescribed Jan Aushadhi generic Metformin / Glimepiride regularly.",
      "Check feet daily for minor cuts or blisters to prevent diabetic ulcers."
    ],
    redFlags: [
      "Extreme confusion, fruity breath odor, or heavy panting (Ketoacidosis alert)",
      "Sudden shaking, sweating, dizziness with sugar < 70 mg/dL (Hypoglycemia - eat 1 spoon sugar/sweet immediately!)",
      "Non-healing foot wound or blackening of toes"
    ],
    dietAdvice: [
      "Eat multigrain roti (Barley/Jowar/Bajra/Chana), green vegetables, sprouted pulses.",
      "Avoid sugar, jaggery, honey, soft drinks, maida, and sweets."
    ],
    quickReplies: ["शुगर नॉर्मल कितनी होनी चाहिए?", "सुबह क्या खाना चाहिए?", "फ्री जांच कहां होगी?"]
  },

  // 12. Critical Red Flag: Cardiac Emergency (Heart Attack / Seene me Dard)
  {
    id: "cardiac_emergency",
    nameEn: "Acute Coronary Syndrome (Suspected Heart Attack)",
    nameHi: "गंभीर हृदय आपातकाल (हार्ट अटैक का संदेह)",
    nameMr: "हार्ट अटॅक / छातीतील तीव्र वेदना",
    department: "Emergency Trauma / ICU",
    facilityTier: "District Hospital / Tertiary Cardiology Hub",
    triageLevel: "CRITICAL_108",
    isEmergency: true,
    priorityScore: 100,
    triggers: [
      "chest pain", "chhati me dard", "seene me dard", "dil me dard", "heart attack", "left arm",
      "pasina", "sweating", "ghabrahat seena", "chhati", "छाती में दर्द", "हार्ट अटैक", "छातीत कळ"
    ],
    explanationEn: "CRITICAL EMERGENCY: Severe substernal pressure, squeezing chest heaviness radiating to left arm, neck, or jaw with cold sweats indicates active cardiac distress.",
    explanationHi: "अति-आपातकालीन चेतावनी: सीने में भारी दबाव, जकड़न, बाएं हाथ या जबड़े में फैलता दर्द और ठंडा पसीना दिल के दौरे (हार्ट अटैक) का संकेत हो सकता है। तुरंत 108 डायल करें।",
    explanationMr: "तातडीची वैद्यकीय आणीबाणी: छातीत तीव्र वेदना, डाव्या हाताला कळ आणि घाम येणे हे हार्ट अटॅकचे लक्षण आहे. त्वरित १०८ डायल करा.",
    homeRemediesEn: [
      "DIAL 108 IMMEDIATELY for an Emergency Ambulance with ECG & defibrillator.",
      "If advised by doctor / emergency operator: Chew 1 non-coated Aspirin (Dispirin 300mg) immediately.",
      "Position: Make patient sit in a half-upright comfortable position (do NOT let them walk or exert).",
      "Loosen tight clothing around neck and chest; ensure cross-ventilation."
    ],
    homeRemediesHi: [
      "तुरंत 108 पर कॉल करें और नजदीकी अस्पताल के लिए एम्बुलेंस बुलाएं।",
      "यदि डॉक्टर की सलाह मिले: मरीज को 1 डिस्प्रिन (Aspirin 300mg) तुरंत चबाने को दें।",
      "मरीज को पीठ के सहारे अर्ध-बैठी मुद्रा में आराम से बिठाएं। मरीज को बिल्कुल चलने न दें।",
      "गर्दन और छाती के कपड़े ढीले करें और हवा आने दें।"
    ],
    homeRemediesMr: [
      "त्वरित १०८ रुग्णवाहिका बोलवा.",
      "रुग्णाला बसवून ठेवावे, हालचाल करू देऊ नये.",
      "घट्ट कपडे सैल करावेत आणि मोकळी हवा मिळू द्यावी."
    ],
    safeFirstAid: [
      "Emergency ECG at nearest hospital within golden hour.",
      "Keep patient calm to prevent heart rate spike."
    ],
    redFlags: [
      "Loss of consciousness or sudden collapse",
      "Severe breathlessness and blue lips",
      "No pulse or irregular weak heartbeat"
    ],
    dietAdvice: ["Do not give heavy food or water during active acute attack."],
    quickReplies: ["108 पर कॉल करें", "नजदीकी अस्पताल कहां है?", "मरीज को कैसे बिठाएं?"]
  },

  // 13. Critical Red Flag: Snakebite (सर्पदंश)
  {
    id: "snakebite",
    nameEn: "Acute Snakebite / Envenomation Emergency",
    nameHi: "सर्पदंश आपातकाल (सांप का काटना)",
    nameMr: "सर्पदंश / साप चावणे",
    department: "Emergency Resuscitation (ASV Center)",
    facilityTier: "CHC / Sub-District Hospital / District Hospital",
    triageLevel: "CRITICAL_108",
    isEmergency: true,
    priorityScore: 100,
    triggers: [
      "saanp", "sanp", "snake", "snakebite", "kat liya", "dant", "fangs", "zeher", "saap",
      "सर्प", "सांप ने काटा", "साप चावला"
    ],
    explanationEn: "CRITICAL EMERGENCY: Venomous snakebites require immediate Polyvalent Anti-Snake Venom (ASV) at a government hospital. Do not waste time in unproven faith-healing.",
    explanationHi: "अति-आपातकालीन चेतावनी: जहरीले सांप के काटने पर केवल सरकारी अस्पताल में मिलने वाला एंटी-वेनम (ASV) ही जान बचा सकता है। झाड़-फूंक में समय न गंवाएं।",
    explanationMr: "तातडीची आणीबाणी: साप चावल्यास त्वरित सरकारी रुग्णालयात जाऊन अँटी-व्हेनम इंजेक्शन घ्यावे. अंधश्रद्धा किंवा मंत्रतंत्रात वेळ वाया घालवू नका.",
    homeRemediesEn: [
      "IMMOBILIZE THE BITTEN LIMB with a splint/cloth (keep still like a fractured bone).",
      "DO NOT cut the wound, DO NOT suck venom, and DO NOT tie tight tourniquets (leads to gangrene).",
      "Remove rings, bangles, and tight footwear before swelling occurs.",
      "Rush immediately to nearest government CHC/Hospital with Anti-Snake Venom (ASV)."
    ],
    homeRemediesHi: [
      "जिस अंग पर काटा है उसे बिल्कुल न हिलाएं (कपड़े या लकड़ी की फट्टी से स्थिर करें)।",
      "घाव पर चीरा न लगाएं, मुंह से जहर न चूसें और न ही कसकर रस्सी बांधें (इससे अंग सड़ने का खतरा होता है)।",
      "अंगूठी, कड़ा, चूड़ी या जूते तुरंत उतार लें क्योंकि सूजन तेजी से बढ़ती है।",
      "सीधे नजदीकी सरकारी अस्पताल जाएं जहां ASV इंजेक्शन उपलब्ध हो।"
    ],
    homeRemediesMr: [
      "चावलेला हात किंवा पाय अजिबात हलवू नका.",
      "जखमेवर काप मारू नका, रक्त चोखू नका आणि दोरी घट्ट बांधू नका.",
      "दागिने व घट्ट वस्तू त्वरित काढून टाकाव्यात.",
      "थेट सरकारी रुग्णालयात जाऊन ASV लस घ्यावी."
    ],
    safeFirstAid: ["Polyvalent Anti-Snake Venom (ASV) injection administered under medical supervision."],
    redFlags: [
      "Drooping eyelids (Ptosis), difficulty speaking or swallowing",
      "Bleeding from bite site, gums, or urine",
      "Rapidly spreading swelling and severe pain"
    ],
    dietAdvice: ["Do not give food, alcohol, or sedatives."],
    quickReplies: ["108 एम्बुलेंस बुलाएं", "एंटी-वेनम कहां मिलेगा?", "घाव को कैसे रखें?"]
  }
];

export class RuralTriageEngine {
  private accumulatedSymptoms: Set<string> = new Set();
  private conversationHistory: Array<{ role: "user" | "assistant"; text: string }> = [];

  public reset(): void {
    this.accumulatedSymptoms.clear();
    this.conversationHistory = [];
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[\.,\?!;:_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  public evaluate(userMessage: string, preferredLang: "en" | "hi" | "mr" = "hi"): TriageResult {
    const norm = this.normalizeText(userMessage);

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
      let score = rule.priorityScore || 0;
      let ruleTriggersMatched = 0;

      // Check compound keyword groups if defined (e.g. Fever AND Diarrhea)
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
          score += 60; // Major boost for compound symptom combinations
        } else {
          score = 0; // If required compound keywords not met, do not trigger this compound rule
        }
      }

      // Check individual triggers
      if (score > 0 || !rule.requiredKeywords) {
        for (const trigger of rule.triggers) {
          if (cumulativeText.includes(trigger)) {
            score += 15;
            ruleTriggersMatched++;
            if (!detectedTriggers.includes(trigger)) {
              detectedTriggers.push(trigger);
            }
          }
        }
      }

      if (score > highestScore && (ruleTriggersMatched > 0 || score >= 60)) {
        highestScore = score;
        bestMatch = rule;
      }
    }

    // Default fallback if no specific condition matched
    if (!bestMatch) {
      bestMatch = {
        id: "general_checkup",
        nameEn: "Primary Health Triage & General Consultation",
        nameHi: "प्राथमिक स्वास्थ्य जांच व सामान्य परामर्श",
        nameMr: "प्राथमिक आरोग्य तपासणी व सल्ला",
        department: "General OPD",
        facilityTier: "Ayushman Arogya Mandir / Village Sub-Center",
        triageLevel: "ROUTINE",
        isEmergency: false,
        triggers: [],
        explanationEn: `I have noted your reported symptoms: "${userMessage}". For rural primary care, rest, light digestible food, and hydration are essential while consulting your local ASHA worker.`,
        explanationHi: `मैंने आपके बताए लक्षण दर्ज कर लिए हैं: "${userMessage}"। प्राथमिक देखभाल के लिए पर्याप्त आराम, हल्का सुपाच्य भोजन और गुनगुना पानी लें तथा गांव की आशा दीदी से परामर्श लें।`,
        explanationMr: `तुमची लक्षणे नोंदवली आहेत: "${userMessage}". विश्रांती, भरपूर पाणी आणि हलका आहार घ्यावा व आशा सेविकेशी संपर्क साधावा.`,
        homeRemediesEn: [
          "Drink warm boiled water throughout the day to support body immunity.",
          "Eat freshly prepared light food like Moong Dal Khichdi and vegetable soup.",
          "Take complete physical rest in a clean, ventilated room."
        ],
        homeRemediesHi: [
          "दिन भर में हल्का गुनगुना उबला पानी पिएं।",
          "हल्का और ताजा सुपाच्य भोजन (मूंग दाल की खिचड़ी, दलिया, सूप) लें।",
          "साफ और हवादार कमरे में पर्याप्त आराम करें।"
        ],
        homeRemediesMr: [
          "दिवसभरात कोमट उकळलेले पाणी प्यावे.",
          "हलका आणि ताजा आहार (मुगाची खिचडी, सूप) घ्यावा.",
          "पुरेशी विश्रांती घ्यावी."
        ],
        safeFirstAid: [
          "Basic Vitals Check (BP, Pulse, Temperature, SpO2) at Sub-Center.",
          "Consult ASHA worker or Community Health Officer (CHO) at Ayushman Arogya Mandir."
        ],
        redFlags: [
          "Sudden high fever with shivering or seizures",
          "Severe shortness of breath or persistent chest pain",
          "Continuous vomiting or severe dehydration"
        ],
        dietAdvice: ["Eat light, non-spicy, home-cooked food."],
        quickReplies: ["मुझे बुखार है", "पेट में दर्द है", "खांसी और जुकाम है"]
      };
    }

    const confidence = Math.min(0.96, Math.max(0.72, highestScore / 90));

    // Construct formatted multilingual output
    const remedies = preferredLang === "mr"
      ? (bestMatch.homeRemediesMr || bestMatch.homeRemediesHi)
      : preferredLang === "en"
      ? bestMatch.homeRemediesEn
      : bestMatch.homeRemediesHi;

    const explanation = preferredLang === "mr"
      ? (bestMatch.explanationMr || bestMatch.explanationHi)
      : preferredLang === "en"
      ? bestMatch.explanationEn
      : bestMatch.explanationHi;

    const condName = preferredLang === "mr"
      ? (bestMatch.nameMr || bestMatch.nameHi)
      : preferredLang === "en"
      ? bestMatch.nameEn
      : bestMatch.nameHi;

    // Rich formatted answer
    let formattedReply = `📋 **${condName}**\n\n`;
    formattedReply += `${explanation}\n\n`;
    formattedReply += `🌿 **घरेलू नुस्खे / Home Remedies:**\n`;
    remedies.forEach((r) => {
      formattedReply += `• ${r}\n`;
    });
    if (bestMatch.safeFirstAid && bestMatch.safeFirstAid.length > 0) {
      formattedReply += `\n💊 **प्राथमिक सलाह / Safe Care:**\n`;
      bestMatch.safeFirstAid.forEach((f) => {
        formattedReply += `• ${f}\n`;
      });
    }
    if (bestMatch.isEmergency) {
      formattedReply += `\n🚨 **अति-आपातकाल: तुरंत 108 डायल करें या नजदीकी सरकारी अस्पताल जाएं!**`;
    }

    return {
      suspectedCondition: bestMatch.nameEn,
      conditionHindi: bestMatch.nameHi,
      conditionMarathi: bestMatch.nameMr,
      confidenceScore: Math.round(confidence * 100) / 100,
      triageLevel: bestMatch.triageLevel,
      department: bestMatch.department,
      facilityTier: bestMatch.facilityTier,
      detectedSymptoms: detectedTriggers.slice(0, 5),
      explanationEnglish: bestMatch.explanationEn,
      explanationHindi: bestMatch.explanationHi,
      explanationMarathi: bestMatch.explanationMr,
      homeRemediesEnglish: bestMatch.homeRemediesEn,
      homeRemediesHindi: bestMatch.homeRemediesHi,
      homeRemediesMarathi: bestMatch.homeRemediesMr,
      safeFirstAid: bestMatch.safeFirstAid,
      redFlags: bestMatch.redFlags,
      dietAdvice: bestMatch.dietAdvice,
      quickReplies: bestMatch.quickReplies,
      isEmergency: bestMatch.isEmergency,
      formattedReply
    };
  }
}

export const ruralTriageEngine = new RuralTriageEngine();
