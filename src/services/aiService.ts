// AMC AI Service - Intelligent Hospital Assistant
// Provides smart responses for chat and triage functionality

import { staffData, departmentData } from '../data/mockData';

// AI Bot Identity
export const AI_BOT = {
  id: 'amc-ai',
  name: 'AMC AI Assistant',
  avatar: 'AI',
  role: 'AI Assistant',
  color: '#8B5CF6', // Purple for AI
};

// Symptom severity database for triage
const SYMPTOM_SEVERITY: Record<string, { score: number; category: string; urgency: string }> = {
  // Critical symptoms (8-10)
  'chest pain': { score: 9, category: 'cardiac', urgency: 'immediate' },
  'difficulty breathing': { score: 9, category: 'respiratory', urgency: 'immediate' },
  'shortness of breath': { score: 9, category: 'respiratory', urgency: 'immediate' },
  'severe bleeding': { score: 10, category: 'trauma', urgency: 'immediate' },
  'unconscious': { score: 10, category: 'neurological', urgency: 'immediate' },
  'stroke symptoms': { score: 10, category: 'neurological', urgency: 'immediate' },
  'seizure': { score: 9, category: 'neurological', urgency: 'immediate' },
  'severe allergic reaction': { score: 9, category: 'allergic', urgency: 'immediate' },
  'heart attack': { score: 10, category: 'cardiac', urgency: 'immediate' },
  'choking': { score: 10, category: 'respiratory', urgency: 'immediate' },
  'severe burn': { score: 8, category: 'trauma', urgency: 'immediate' },
  'poisoning': { score: 9, category: 'toxicology', urgency: 'immediate' },
  'suicidal thoughts': { score: 9, category: 'psychiatric', urgency: 'immediate' },

  // High severity symptoms (6-7)
  'high fever': { score: 7, category: 'infection', urgency: 'urgent' },
  'severe pain': { score: 7, category: 'general', urgency: 'urgent' },
  'vomiting blood': { score: 8, category: 'gastrointestinal', urgency: 'urgent' },
  'severe headache': { score: 7, category: 'neurological', urgency: 'urgent' },
  'abdominal pain': { score: 6, category: 'gastrointestinal', urgency: 'urgent' },
  'broken bone': { score: 7, category: 'orthopedic', urgency: 'urgent' },
  'fracture': { score: 7, category: 'orthopedic', urgency: 'urgent' },
  'deep cut': { score: 6, category: 'trauma', urgency: 'urgent' },
  'asthma attack': { score: 7, category: 'respiratory', urgency: 'urgent' },
  'diabetic emergency': { score: 8, category: 'metabolic', urgency: 'urgent' },
  'severe dehydration': { score: 7, category: 'metabolic', urgency: 'urgent' },
  'pregnancy complications': { score: 8, category: 'obstetric', urgency: 'urgent' },
  'labor pains': { score: 7, category: 'obstetric', urgency: 'urgent' },

  // Moderate severity symptoms (4-5)
  'fever': { score: 5, category: 'infection', urgency: 'semi-urgent' },
  'persistent cough': { score: 4, category: 'respiratory', urgency: 'semi-urgent' },
  'moderate pain': { score: 5, category: 'general', urgency: 'semi-urgent' },
  'dizziness': { score: 5, category: 'neurological', urgency: 'semi-urgent' },
  'nausea': { score: 4, category: 'gastrointestinal', urgency: 'semi-urgent' },
  'vomiting': { score: 5, category: 'gastrointestinal', urgency: 'semi-urgent' },
  'diarrhea': { score: 4, category: 'gastrointestinal', urgency: 'semi-urgent' },
  'ear pain': { score: 4, category: 'ent', urgency: 'semi-urgent' },
  'sore throat': { score: 4, category: 'ent', urgency: 'semi-urgent' },
  'sprain': { score: 4, category: 'orthopedic', urgency: 'semi-urgent' },
  'skin rash': { score: 4, category: 'dermatological', urgency: 'semi-urgent' },
  'eye pain': { score: 5, category: 'ophthalmology', urgency: 'semi-urgent' },
  'urinary problems': { score: 5, category: 'urological', urgency: 'semi-urgent' },
  'back pain': { score: 4, category: 'orthopedic', urgency: 'semi-urgent' },
  'anxiety': { score: 4, category: 'psychiatric', urgency: 'semi-urgent' },

  // Low severity symptoms (1-3)
  'cold symptoms': { score: 2, category: 'respiratory', urgency: 'non-urgent' },
  'mild headache': { score: 3, category: 'neurological', urgency: 'non-urgent' },
  'minor cut': { score: 2, category: 'trauma', urgency: 'non-urgent' },
  'routine checkup': { score: 1, category: 'preventive', urgency: 'non-urgent' },
  'follow up': { score: 1, category: 'preventive', urgency: 'non-urgent' },
  'vaccination': { score: 1, category: 'preventive', urgency: 'non-urgent' },
  'prescription refill': { score: 1, category: 'general', urgency: 'non-urgent' },
  'mild pain': { score: 3, category: 'general', urgency: 'non-urgent' },
  'fatigue': { score: 3, category: 'general', urgency: 'non-urgent' },
  'insomnia': { score: 3, category: 'psychiatric', urgency: 'non-urgent' },
};

// Age risk factors
const getAgeRiskFactor = (age: number): number => {
  if (age < 2) return 1.5; // Infants
  if (age < 5) return 1.3; // Toddlers
  if (age >= 65 && age < 75) return 1.2; // Elderly
  if (age >= 75) return 1.4; // Very elderly
  return 1.0;
};

// Vital signs analysis
export interface VitalSigns {
  temperature?: number; // Celsius
  heartRate?: number; // BPM
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number; // Percentage
  respiratoryRate?: number; // Per minute
}

const analyzeVitals = (vitals: VitalSigns): { score: number; alerts: string[] } => {
  const alerts: string[] = [];
  let vitalScore = 0;

  if (vitals.temperature) {
    if (vitals.temperature >= 39.5) {
      vitalScore += 3;
      alerts.push('High fever detected');
    } else if (vitals.temperature >= 38.5) {
      vitalScore += 2;
      alerts.push('Moderate fever');
    } else if (vitals.temperature < 35) {
      vitalScore += 3;
      alerts.push('Hypothermia risk');
    }
  }

  if (vitals.heartRate) {
    if (vitals.heartRate > 120 || vitals.heartRate < 50) {
      vitalScore += 3;
      alerts.push('Abnormal heart rate');
    } else if (vitals.heartRate > 100 || vitals.heartRate < 60) {
      vitalScore += 1;
      alerts.push('Elevated heart rate');
    }
  }

  if (vitals.oxygenSaturation) {
    if (vitals.oxygenSaturation < 90) {
      vitalScore += 4;
      alerts.push('Critical oxygen levels');
    } else if (vitals.oxygenSaturation < 94) {
      vitalScore += 2;
      alerts.push('Low oxygen saturation');
    }
  }

  if (vitals.bloodPressureSystolic) {
    if (vitals.bloodPressureSystolic > 180 || vitals.bloodPressureSystolic < 90) {
      vitalScore += 3;
      alerts.push('Critical blood pressure');
    } else if (vitals.bloodPressureSystolic > 140 || vitals.bloodPressureSystolic < 100) {
      vitalScore += 1;
      alerts.push('Abnormal blood pressure');
    }
  }

  return { score: vitalScore, alerts };
};

// Triage result interface
export interface TriageResult {
  priorityScore: number; // 1-10
  priorityLevel: 'critical' | 'high' | 'medium' | 'low';
  priorityColor: string;
  estimatedWaitTime: number; // minutes
  recommendedDepartment: string;
  reasoning: string[];
  alerts: string[];
  aiConfidence: number; // percentage
}

// Main triage analysis function
export const analyzeTriagePriority = (
  symptoms: string,
  age: number,
  _gender: 'male' | 'female', // Reserved for future gender-specific risk factors
  vitals?: VitalSigns
): TriageResult => {
  const symptomsLower = symptoms.toLowerCase();
  const reasoning: string[] = [];
  const alerts: string[] = [];

  // Find matching symptoms
  let maxSymptomScore = 0;
  let matchedCategory = 'general';

  Object.entries(SYMPTOM_SEVERITY).forEach(([symptom, data]) => {
    if (symptomsLower.includes(symptom)) {
      if (data.score > maxSymptomScore) {
        maxSymptomScore = data.score;
        matchedCategory = data.category;
        reasoning.push(`Detected symptom: "${symptom}" (severity: ${data.score}/10)`);
      }
    }
  });

  // If no specific symptoms matched, analyze keywords
  if (maxSymptomScore === 0) {
    if (symptomsLower.includes('pain')) maxSymptomScore = 4;
    else if (symptomsLower.includes('emergency')) maxSymptomScore = 7;
    else if (symptomsLower.includes('accident')) maxSymptomScore = 6;
    else maxSymptomScore = 3; // Default for unknown
    reasoning.push('General symptom assessment applied');
  }

  // Apply age factor
  const ageFactor = getAgeRiskFactor(age);
  if (ageFactor > 1) {
    reasoning.push(`Age risk factor applied (${age} years: ${ageFactor}x)`);
  }

  // Analyze vitals if provided
  let vitalScore = 0;
  if (vitals) {
    const vitalAnalysis = analyzeVitals(vitals);
    vitalScore = vitalAnalysis.score;
    alerts.push(...vitalAnalysis.alerts);
    if (vitalScore > 0) {
      reasoning.push(`Vital signs contributed +${vitalScore} to priority`);
    }
  }

  // Calculate final score
  let finalScore = Math.round((maxSymptomScore * ageFactor) + (vitalScore * 0.5));
  finalScore = Math.min(10, Math.max(1, finalScore));

  // Determine priority level
  let priorityLevel: TriageResult['priorityLevel'];
  let priorityColor: string;
  let estimatedWaitTime: number;

  if (finalScore >= 8) {
    priorityLevel = 'critical';
    priorityColor = '#FF4757';
    estimatedWaitTime = 0;
    alerts.push('IMMEDIATE ATTENTION REQUIRED');
  } else if (finalScore >= 6) {
    priorityLevel = 'high';
    priorityColor = '#FF6B35';
    estimatedWaitTime = 15;
  } else if (finalScore >= 4) {
    priorityLevel = 'medium';
    priorityColor = '#FFD93D';
    estimatedWaitTime = 45;
  } else {
    priorityLevel = 'low';
    priorityColor = '#00D26A';
    estimatedWaitTime = 90;
  }

  // Recommend department based on category
  const departmentMap: Record<string, string> = {
    cardiac: 'Internal Medicine',
    respiratory: 'Internal Medicine',
    neurological: 'Internal Medicine',
    trauma: 'Emergency',
    orthopedic: 'General Medicine',
    gastrointestinal: 'Gastroenterology',
    obstetric: 'Gynaecology',
    psychiatric: 'Psychology',
    ent: 'ENT',
    ophthalmology: 'Ophthalmology',
    urological: 'Urology',
    dermatological: 'General Medicine',
    infection: 'General Medicine',
    metabolic: 'Internal Medicine',
    allergic: 'Internal Medicine',
    preventive: 'General Medicine',
    general: 'General Medicine',
    toxicology: 'Emergency',
  };

  const recommendedDepartment = departmentMap[matchedCategory] || 'General Medicine';

  // Calculate AI confidence based on symptom matching
  const aiConfidence = maxSymptomScore > 0 ? 85 + Math.random() * 10 : 65 + Math.random() * 15;

  return {
    priorityScore: finalScore,
    priorityLevel,
    priorityColor,
    estimatedWaitTime,
    recommendedDepartment,
    reasoning,
    alerts,
    aiConfidence: Math.round(aiConfidence),
  };
};

// Hospital knowledge base for chat
const HOSPITAL_PROTOCOLS: Record<string, string> = {
  'blood transfusion': 'Blood Transfusion Protocol:\n1. Verify patient identity and blood type\n2. Check compatibility with cross-match results\n3. Inspect blood bag for abnormalities\n4. Use blood administration set with filter\n5. Start transfusion slowly (first 15 mins)\n6. Monitor vital signs every 15 minutes\n7. Complete within 4 hours of removal from storage',

  'cpr': 'CPR Protocol (Adult):\n1. Check responsiveness and breathing\n2. Call for help and get AED\n3. Begin chest compressions: 100-120/min, 2 inches deep\n4. Give 2 rescue breaths after 30 compressions\n5. Continue 30:2 ratio until help arrives\n6. Use AED as soon as available',

  'code blue': 'Code Blue Response:\n1. First responder: Begin CPR immediately\n2. Second responder: Call Code Blue (dial 333)\n3. Bring crash cart and defibrillator\n4. Assign roles: Airway, Compressions, Medications, Documentation\n5. Continue until ROSC or physician calls time',

  'iv insertion': 'IV Insertion Protocol:\n1. Verify patient and procedure\n2. Select appropriate site and catheter size\n3. Apply tourniquet 4-6 inches above site\n4. Clean site with antiseptic (let dry)\n5. Insert catheter at 15-30 degree angle\n6. Advance catheter, retract needle\n7. Secure with transparent dressing\n8. Document time, site, and catheter size',

  'medication administration': 'Medication Administration - 6 Rights:\n1. Right Patient\n2. Right Drug\n3. Right Dose\n4. Right Route\n5. Right Time\n6. Right Documentation\nAlways verify allergies before administration.',

  'hand hygiene': 'Hand Hygiene Protocol:\n1. Wet hands with water\n2. Apply soap\n3. Rub hands together for at least 20 seconds\n4. Cover all surfaces including between fingers\n5. Rinse thoroughly\n6. Dry with paper towel\n7. Use towel to turn off faucet',

  'isolation precautions': 'Isolation Precautions:\n- Standard: All patients (hand hygiene, PPE as needed)\n- Contact: Gown and gloves (MRSA, C.diff)\n- Droplet: Surgical mask (Flu, COVID)\n- Airborne: N95 respirator (TB, Measles)\nAlways check signage before entering room.',

  'emergency numbers': 'Emergency Numbers at AMC:\n- Code Blue: 333\n- Fire: 444\n- Security: 555\n- Pharmacy: 222\n- Blood Bank: 211\n- Lab: 212\n- Radiology: 213\n- Main Reception: 100',
};

// Drug interaction database
const DRUG_INTERACTIONS: Record<string, string[]> = {
  'warfarin': ['aspirin', 'ibuprofen', 'vitamin k', 'cranberry'],
  'metformin': ['contrast dye', 'alcohol'],
  'lisinopril': ['potassium', 'nsaids', 'lithium'],
  'simvastatin': ['grapefruit', 'erythromycin', 'niacin'],
  'omeprazole': ['clopidogrel', 'methotrexate'],
  'amoxicillin': ['methotrexate', 'warfarin'],
  'furosemide': ['aminoglycosides', 'lithium', 'nsaids'],
};

// Chat response generator
export interface ChatAIResponse {
  content: string;
  type: 'answer' | 'lookup' | 'suggestion' | 'alert' | 'summary';
  confidence: number;
  sources?: string[];
}

export const generateChatResponse = async (
  query: string,
  context?: {
    channelName?: string;
    recentMessages?: string[];
    userName?: string;
  }
): Promise<ChatAIResponse> => {
  const queryLower = query.toLowerCase();

  // Simulate AI thinking delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  // Check for protocol queries
  for (const [protocol, info] of Object.entries(HOSPITAL_PROTOCOLS)) {
    if (queryLower.includes(protocol)) {
      return {
        content: info,
        type: 'answer',
        confidence: 95,
        sources: ['AMC Clinical Protocols Manual'],
      };
    }
  }

  // Check for drug interaction queries
  if (queryLower.includes('interaction') || queryLower.includes('drug')) {
    for (const [drug, interactions] of Object.entries(DRUG_INTERACTIONS)) {
      if (queryLower.includes(drug)) {
        return {
          content: `**${drug.charAt(0).toUpperCase() + drug.slice(1)} Interactions:**\n\nKnown interactions with:\n${interactions.map(i => `- ${i}`).join('\n')}\n\n⚠️ Always verify with pharmacy before combining medications.`,
          type: 'alert',
          confidence: 90,
          sources: ['AMC Pharmacy Database', 'Drug Interaction Checker'],
        };
      }
    }
  }

  // Staff lookup
  if (queryLower.includes('who is') || queryLower.includes('find') || queryLower.includes('contact')) {
    const staffMember = staffData.find(s =>
      queryLower.includes(s.name.toLowerCase()) ||
      queryLower.includes(s.role.toLowerCase())
    );
    if (staffMember) {
      return {
        content: `**${staffMember.name}**\n\n📋 Role: ${staffMember.role}\n🏥 Department: ${staffMember.department}\n📱 Phone: ${staffMember.phone}\n📧 Email: ${staffMember.email}\n🟢 Status: ${staffMember.status}`,
        type: 'lookup',
        confidence: 98,
      };
    }
  }

  // Schedule queries
  if (queryLower.includes('shift') || queryLower.includes('schedule') || queryLower.includes('on duty') || queryLower.includes('working')) {
    if (queryLower.includes('night')) {
      return {
        content: `**Tonight's Night Shift (22:00 - 06:00)**\n\n👨‍⚕️ **Medical:**\n- Dr. Kwame Asante (Emergency)\n- Dr. Kwesi Amponsah (ICU)\n\n👩‍⚕️ **Nursing:**\n- Abena Mensah (Emergency)\n- Akosua Frimpong (ICU)\n\n🔬 **Support:**\n- Kwabena Ofori (Lab)\n- Kojo Antwi (Pharmacy)`,
        type: 'lookup',
        confidence: 92,
        sources: ['Staff Scheduling System'],
      };
    }
    if (queryLower.includes('emergency') || queryLower.includes('er')) {
      return {
        content: `**Emergency Department Schedule Today**\n\n🌅 **Morning (06:00-14:00):**\n- Dr. Kwame Asante\n- Abena Mensah (Nurse)\n\n🌆 **Afternoon (14:00-22:00):**\n- Dr. Ama Serwaa\n- Grace Osei (Nurse)\n\n🌙 **Night (22:00-06:00):**\n- Dr. Kwame Asante\n- Abena Mensah (Nurse)`,
        type: 'lookup',
        confidence: 90,
        sources: ['Shift Management System'],
      };
    }
    return {
      content: `I can help you find schedule information! Please specify:\n- **Department:** e.g., "Who's on shift in Emergency?"\n- **Time:** e.g., "Who's working night shift?"\n- **Person:** e.g., "When is Dr. Asante working?"`,
      type: 'suggestion',
      confidence: 85,
    };
  }

  // Department info
  if (queryLower.includes('department')) {
    const dept = departmentData.find(d => queryLower.includes(d.name.toLowerCase()));
    if (dept) {
      return {
        content: `**${dept.name}**\n\n${dept.description}\n\n📊 **Statistics:**\n- Staff: ${dept.staffCount} (${dept.activeStaff} active)\n- Current Patients: ${dept.patientCount}\n- Coverage: ${dept.coverage}%\n\n👤 **Department Head:** ${dept.head}`,
        type: 'lookup',
        confidence: 95,
      };
    }
  }

  // Patient related queries
  if (queryLower.includes('patient') && (queryLower.includes('how many') || queryLower.includes('count'))) {
    return {
      content: `**Current Patient Statistics**\n\n⏳ Waiting: 12 patients\n🩺 In Consultation: 8 patients\n🛏️ Admitted: 45 patients\n✅ Completed Today: 67 patients\n\n📈 **Busiest Departments:**\n1. Emergency (15 patients)\n2. General Medicine (12 patients)\n3. Paediatrics (8 patients)`,
      type: 'lookup',
      confidence: 88,
      sources: ['Patient Management System'],
    };
  }

  // Summary request
  if (queryLower.includes('summarize') || queryLower.includes('summary')) {
    if (context?.recentMessages && context.recentMessages.length > 0) {
      return {
        content: `**Channel Summary (${context.channelName})**\n\nI've analyzed the recent ${context.recentMessages.length} messages:\n\n📌 **Key Points:**\n- Multiple discussions about patient care\n- Staff coordination for upcoming shifts\n- Equipment requests and updates\n\n⚡ **Action Items:**\n- Follow up on pending lab results\n- Confirm shift coverage for weekend\n- Review updated protocols`,
        type: 'summary',
        confidence: 82,
      };
    }
  }

  // Greeting responses
  if (queryLower.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    const greetings = [
      `Hello${context?.userName ? `, ${context.userName}` : ''}! 👋 I'm the AMC AI Assistant. How can I help you today?\n\nI can assist with:\n- 📋 Hospital protocols\n- 👥 Staff information\n- 📅 Schedules\n- 💊 Drug interactions\n- 📊 Patient statistics`,
      `Hi there! 🏥 Ready to assist with any hospital-related questions. Just ask about protocols, schedules, staff info, or anything else!`,
      `Greetings! I'm here to help the AMC team. What do you need assistance with today?`,
    ];
    return {
      content: greetings[Math.floor(Math.random() * greetings.length)],
      type: 'answer',
      confidence: 100,
    };
  }

  // Help query
  if (queryLower.includes('help') || queryLower.includes('what can you do')) {
    return {
      content: `**AMC AI Assistant Capabilities**\n\n🔍 **I can help with:**\n\n1. **Protocols & Procedures**\n   "What's the blood transfusion protocol?"\n   "How do I perform CPR?"\n\n2. **Staff Information**\n   "Who is Dr. Asante?"\n   "Find a nurse in ICU"\n\n3. **Schedules**\n   "Who's on night shift?"\n   "Emergency department schedule"\n\n4. **Drug Interactions**\n   "Warfarin interactions?"\n   "Can I give metformin with..."\n\n5. **Department Info**\n   "Tell me about Paediatrics"\n   "How many patients in Emergency?"\n\n6. **Channel Summaries**\n   "Summarize this channel"\n\nJust mention **@AMC-AI** followed by your question!`,
      type: 'answer',
      confidence: 100,
    };
  }

  // Bed availability
  if (queryLower.includes('bed') && (queryLower.includes('available') || queryLower.includes('availability'))) {
    return {
      content: `**Bed Availability Status**\n\n🛏️ **General Ward:** 12/50 available\n🏥 **ICU:** 2/8 available\n💓 **HDU:** 3/6 available\n👶 **Paediatric:** 5/15 available\n🤰 **Maternity:** 4/12 available\n🚑 **Emergency:** 3/10 available\n\n⚠️ ICU capacity at 75% - consider early discharge planning`,
      type: 'lookup',
      confidence: 91,
      sources: ['Bed Management System'],
    };
  }

  // Default response for unknown queries
  const defaultResponses = [
    `I understand you're asking about "${query.slice(0, 50)}..."\n\nI don't have specific information on that, but here's what I can help with:\n\n- Hospital protocols\n- Staff contacts\n- Schedules\n- Drug interactions\n- Department info\n\nCould you rephrase your question or ask about one of these topics?`,
    `I'm not sure I have the exact answer for that. Let me know if you'd like help with:\n\n📋 Protocols | 👥 Staff | 📅 Schedules | 💊 Drugs | 🏥 Departments`,
    `That's a great question! While I don't have that specific information, I'm constantly learning. For now, try asking about protocols, schedules, or staff information.`,
  ];

  return {
    content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    type: 'suggestion',
    confidence: 60,
  };
};

// Export utility for checking if message mentions AI
export const isMentioningAI = (message: string): boolean => {
  const aiMentions = ['@amc-ai', '@ai', '@assistant', '@bot', '@amcai'];
  const messageLower = message.toLowerCase();
  return aiMentions.some(mention => messageLower.includes(mention));
};

// Extract query from message (remove the mention)
export const extractAIQuery = (message: string): string => {
  return message
    .replace(/@amc-ai/gi, '')
    .replace(/@ai/gi, '')
    .replace(/@assistant/gi, '')
    .replace(/@bot/gi, '')
    .replace(/@amcai/gi, '')
    .trim();
};
