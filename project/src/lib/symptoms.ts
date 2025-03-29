// Symptom severity levels
export type Severity = 'mild' | 'moderate' | 'severe';

// Common symptoms and their associated conditions
export const symptoms = [
  'Fever',
  'Cough',
  'Headache',
  'Fatigue',
  'Shortness of breath',
  'Chest pain',
  'Nausea',
  'Dizziness',
  'Body aches',
  'Sore throat',
  'Runny nose',
  'Loss of taste/smell',
  'Abdominal pain',
  'Diarrhea',
  'Joint pain',
  'Rash',
  'Vision problems',
  'Ear pain',
  'Back pain',
  'Muscle weakness',
  'Anxiety',
  'Depression',
  'Insomnia',
  'Loss of appetite',
  'Weight loss',
  'Weight gain',
  'Tremors',
  'Memory problems',
  'Confusion',
  'Swelling',
  'Bleeding',
  'Bruising',
  'High blood pressure',
  'Low blood pressure',
  'Rapid heartbeat',
  'Slow heartbeat',
  'Irregular heartbeat',
  'Wheezing',
  'Sneezing',
  'Itching',
  'Numbness',
  'Tingling',
  'Weakness',
  'Stiffness',
  'Swollen lymph nodes',
  'Night sweats',
  'Excessive thirst',
  'Frequent urination',
  'Blood in urine',
  'Dark urine',
] as const;

export type Symptom = typeof symptoms[number];

export interface SymptomInput {
  name: Symptom;
  severity: Severity;
  duration: string;
  description?: string;
}

export interface Condition {
  name: string;
  probability: number;
  severity: Severity;
  description: string;
  symptoms: string[];
  specialization: string;
  recommendedTests?: string[];
  commonMedications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  matchedSymptoms?: string[];
}

// Medical knowledge base with weighted symptoms and conditions
const medicalKnowledgeBase = {
  'Common Cold': {
    symptoms: {
      'Cough': 0.8,
      'Sore throat': 0.9,
      'Runny nose': 0.95,
      'Fever': 0.6,
      'Fatigue': 0.7,
      'Headache': 0.5,
      'Body aches': 0.4
    },
    severity: 'mild',
    description: 'A viral infection of the upper respiratory tract',
    specialization: 'General Medicine',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '3-5 days',
        instructions: 'Take with or after food'
      }
    ]
  },
  'COVID-19': {
    symptoms: {
      'Fever': 0.9,
      'Cough': 0.8,
      'Fatigue': 0.7,
      'Loss of taste/smell': 0.9,
      'Shortness of breath': 0.6,
      'Body aches': 0.6,
      'Headache': 0.5
    },
    severity: 'severe',
    description: 'A viral respiratory illness caused by the SARS-CoV-2 virus',
    specialization: 'Infectious Disease',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '650mg',
        frequency: 'Every 6 hours',
        duration: '5-7 days',
        instructions: 'Take with food'
      }
    ]
  },
  'Migraine': {
    symptoms: {
      'Headache': 1.0,
      'Nausea': 0.7,
      'Vision problems': 0.6,
      'Dizziness': 0.5,
      'Fatigue': 0.4
    },
    severity: 'moderate',
    description: 'A neurological condition causing severe headaches',
    specialization: 'Neurology',
    medications: [
      {
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed',
        duration: 'Single dose',
        instructions: 'Take at first sign of migraine'
      }
    ]
  },
  'Anxiety Disorder': {
    symptoms: {
      'Anxiety': 1.0,
      'Rapid heartbeat': 0.8,
      'Shortness of breath': 0.6,
      'Dizziness': 0.5,
      'Tremors': 0.4,
      'Insomnia': 0.7
    },
    severity: 'moderate',
    description: 'A mental health condition characterized by excessive worry',
    specialization: 'Psychiatry',
    medications: [
      {
        name: 'Sertraline',
        dosage: '50mg',
        frequency: 'Once daily',
        duration: 'As prescribed',
        instructions: 'Take in the morning'
      }
    ]
  }
};

// Function to analyze symptoms in real-time
export function analyzeSymptoms(patientSymptoms: SymptomInput[]): { conditions: Condition[]; urgencyLevel: Severity } {
  const results: Condition[] = [];
  
  // Calculate condition probabilities based on weighted symptoms
  Object.entries(medicalKnowledgeBase).forEach(([conditionName, data]) => {
    let totalWeight = 0;
    let matchedWeight = 0;
    let severityScore = 0;
    const matchedSymptoms: string[] = [];

    patientSymptoms.forEach(symptom => {
      if (data.symptoms[symptom.name]) {
        matchedSymptoms.push(symptom.name);
        const weight = data.symptoms[symptom.name];
        totalWeight += weight;
        matchedWeight += weight;

        // Add to severity score based on symptom severity
        severityScore += symptom.severity === 'severe' ? 2 : 
                        symptom.severity === 'moderate' ? 1 : 0;
      }
    });

    // Calculate probability only if there are matched symptoms
    if (matchedSymptoms.length > 0) {
      const probability = (matchedWeight / totalWeight) * 100;
      
      // Determine condition severity based on symptom severity scores
      const severity: Severity = severityScore > 3 ? 'severe' : 
                               severityScore > 1 ? 'moderate' : 'mild';

      results.push({
        name: conditionName,
        probability: Math.round(probability),
        severity,
        description: data.description,
        specialization: data.specialization,
        symptoms: Object.keys(data.symptoms),
        matchedSymptoms,
        commonMedications: data.medications,
      });
    }
  });

  // Sort by probability and filter relevant conditions
  const sortedConditions = results
    .filter(c => c.probability > 30)
    .sort((a, b) => b.probability - a.probability);

  // Determine overall urgency level
  const maxSeverity = sortedConditions.reduce(
    (max, condition) => {
      const severityMap = { mild: 1, moderate: 2, severe: 3 };
      return severityMap[condition.severity] > severityMap[max] ? condition.severity : max;
    },
    'mild' as Severity
  );

  return {
    conditions: sortedConditions,
    urgencyLevel: maxSeverity
  };
}

export function generatePrescription(
  patientName: string,
  patientAge: number,
  condition: Condition,
  symptoms: SymptomInput[],
  doctorName: string,
  hospitalName: string,
  date: string
) {
  return {
    patientInfo: {
      name: patientName,
      age: patientAge
    },
    symptoms,
    diagnosis: {
      condition: condition.name,
      description: condition.description,
      severity: condition.severity
    },
    medications: condition.commonMedications || [],
    recommendations: [
      'Take medications as prescribed',
      'Get adequate rest',
      'Stay hydrated',
      'Follow up if symptoms persist or worsen',
      ...(condition.recommendedTests ? [`Recommended tests: ${condition.recommendedTests.join(', ')}`] : [])
    ],
    doctor: {
      name: doctorName,
      hospital: hospitalName,
      date: date
    }
  };
}