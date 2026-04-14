const API_KEY = import.meta.env.VITE_AI_API_KEY || '';

export interface HealthResponse {
  problem: string;
  causes: string[];
  effects: string[];
  risks: string[];
  symptoms: string[];
  doctor_type: string;
  remedies: string[];
  medicines: string[];
  hospitals: string[];
}

export async function checkHealth(query: string): Promise<HealthResponse> {
  const prompt = `You are a medical AI assistant. Analyze the following health concern and return ONLY valid JSON with this exact structure:
{
  "problem": "name of the health problem",
  "causes": ["cause 1", "cause 2", "cause 3"],
  "effects": ["effect on body 1", "effect on body 2", "effect on body 3"],
  "risks": ["future risk 1", "future risk 2", "future risk 3"],
  "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4"],
  "doctor_type": "type of doctor to consult",
  "remedies": ["home remedy 1", "home remedy 2", "home remedy 3"],
  "medicines": ["safe OTC medicine 1", "safe OTC medicine 2", "safe OTC medicine 3"],
  "hospitals": ["suggested hospital type 1", "suggested hospital type 2"]
}

Health concern: "${query}"

Return ONLY the JSON object, no markdown, no explanation.`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: 'You are a medical AI assistant. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    // Fallback: generate structured response locally
    return generateFallbackResponse(query);
  }
}

function generateFallbackResponse(query: string): HealthResponse {
  const q = query.toLowerCase();
  
  const responses: Record<string, HealthResponse> = {
    headache: {
      problem: 'Headache',
      causes: ['Stress and tension', 'Dehydration', 'Lack of sleep', 'Eye strain from screens', 'Sinus congestion'],
      effects: ['Reduced concentration and productivity', 'Irritability and mood changes', 'Sensitivity to light and sound', 'Muscle tension in neck and shoulders'],
      risks: ['Chronic migraine development', 'Medication overuse headache', 'Sleep disorders', 'Depression and anxiety'],
      symptoms: ['Throbbing or pulsing pain', 'Pressure around forehead', 'Nausea', 'Sensitivity to light', 'Neck stiffness'],
      doctor_type: 'Neurologist',
      remedies: ['Apply cold or warm compress to forehead', 'Stay hydrated with adequate water intake', 'Practice relaxation techniques and deep breathing', 'Ensure 7-8 hours of quality sleep', 'Take regular screen breaks'],
      medicines: ['Paracetamol (Acetaminophen)', 'Ibuprofen', 'Aspirin', 'Naproxen'],
      hospitals: ['Neurology department at multi-specialty hospitals', 'AIIMS Nagpur', 'Government Medical College Hospital'],
    },
    fever: {
      problem: 'Fever',
      causes: ['Viral infections (flu, common cold)', 'Bacterial infections', 'Inflammatory conditions', 'Heat exhaustion', 'Immunization reactions'],
      effects: ['Increased metabolic rate', 'Dehydration from sweating', 'Muscle aches and weakness', 'Loss of appetite', 'Fatigue and lethargy'],
      risks: ['Febrile seizures in children', 'Dehydration complications', 'Underlying serious infection', 'Organ damage in extreme cases'],
      symptoms: ['Body temperature above 37.5 C', 'Chills and shivering', 'Sweating', 'Headache', 'Muscle aches', 'Loss of appetite'],
      doctor_type: 'General Physician',
      remedies: ['Rest adequately', 'Stay hydrated with water and fluids', 'Use lukewarm sponge baths', 'Wear light clothing', 'Eat light and easily digestible food'],
      medicines: ['Paracetamol (Acetaminophen)', 'Ibuprofen', 'Aspirin (adults only)'],
      hospitals: ['General Medicine department', 'Government Medical College Hospital', 'AIIMS Nagpur'],
    },
    cough: {
      problem: 'Cough',
      causes: ['Viral respiratory infections', 'Allergies and asthma', 'Acid reflux (GERD)', 'Environmental irritants', 'Smoking'],
      effects: ['Throat irritation and soreness', 'Chest muscle strain', 'Sleep disruption', 'Social embarrassment', 'Rib pain from persistent coughing'],
      risks: ['Chronic bronchitis', 'Pneumonia', 'Asthma exacerbation', 'Sleep deprivation', 'Urinary incontinence from strain'],
      symptoms: ['Persistent throat clearing', 'Chest congestion', 'Sore throat', 'Runny or stuffy nose', 'Wheezing', 'Shortness of breath'],
      doctor_type: 'Pulmonologist',
      remedies: ['Drink warm water with honey', 'Gargle with warm salt water', 'Use steam inhalation', 'Avoid cold drinks and ice cream', 'Use a humidifier'],
      medicines: ['Dextromethorphan (for dry cough)', 'Guaifenesin (for productive cough)', 'Lozenges', 'Antihistamines for allergic cough'],
      hospitals: ['Pulmonology department', 'Lata Mangeshkar Hospital', 'Wockhardt Hospital'],
    },
    'back pain': {
      problem: 'Back Pain',
      causes: ['Poor posture and ergonomics', 'Muscle or ligament strain', 'Herniated or bulging discs', 'Sedentary lifestyle', 'Obesity'],
      effects: ['Limited mobility and flexibility', 'Difficulty performing daily activities', 'Sleep disturbances', 'Muscle weakness', 'Reduced quality of life'],
      risks: ['Chronic pain syndrome', 'Nerve damage (sciatica)', 'Spinal stenosis', 'Permanent mobility issues', 'Depression from chronic pain'],
      symptoms: ['Dull aching pain in lower back', 'Sharp localized pain', 'Muscle stiffness', 'Pain radiating to legs', 'Difficulty standing straight'],
      doctor_type: 'Orthopedic Specialist',
      remedies: ['Apply hot or cold packs', 'Gentle stretching exercises', 'Maintain proper posture', 'Use ergonomic furniture', 'Regular low-impact exercise like walking'],
      medicines: ['Ibuprofen', 'Naproxen', 'Paracetamol', 'Muscle relaxants (consult doctor)'],
      hospitals: ['Orthopedics department', 'Ravi Kiran Hospital', 'AIIMS Nagpur'],
    },
    'stomach pain': {
      problem: 'Stomach Pain',
      causes: ['Indigestion and gas', 'Gastritis', 'Food poisoning', 'Irritable Bowel Syndrome', 'Peptic ulcers'],
      effects: ['Loss of appetite', 'Nausea and vomiting', 'Bloating and discomfort', 'Weight changes', 'Disrupted daily routine'],
      risks: ['Chronic gastritis', 'Peptic ulcer complications', 'Malnutrition', 'Gastrointestinal bleeding', 'IBS worsening'],
      symptoms: ['Cramping or sharp abdominal pain', 'Bloating', 'Nausea', 'Changes in bowel habits', 'Heartburn', 'Loss of appetite'],
      doctor_type: 'Gastroenterologist',
      remedies: ['Eat smaller, more frequent meals', 'Avoid spicy and fatty foods', 'Drink ginger tea', 'Stay hydrated', 'Practice stress management'],
      medicines: ['Antacids', 'Omeprazole', 'Ranitidine', 'Simethicone for gas'],
      hospitals: ['Gastroenterology department', 'Meditrina Hospital', 'Kingsway Hospital'],
    },
    'skin rash': {
      problem: 'Skin Rash',
      causes: ['Allergic reactions', 'Contact dermatitis', 'Eczema', 'Fungal infections', 'Viral infections'],
      effects: ['Itching and discomfort', 'Skin discoloration', 'Scarring if scratched', 'Social anxiety', 'Sleep disruption from itching'],
      risks: ['Secondary bacterial infection', 'Chronic eczema', 'Permanent scarring', 'Spread of infection', 'Anaphylaxis in severe allergies'],
      symptoms: ['Red patches on skin', 'Itching', 'Bumps or blisters', 'Dry and scaly skin', 'Swelling', 'Warmth in affected area'],
      doctor_type: 'Dermatologist',
      remedies: ['Apply cool compress', 'Use fragrance-free moisturizer', 'Avoid scratching', 'Use gentle soap', 'Identify and avoid triggers'],
      medicines: ['Hydrocortisone cream', 'Antihistamines (Cetirizine)', 'Calamine lotion', 'Antifungal cream if fungal'],
      hospitals: ['Dermatology department', 'Skin City Clinic', 'Government Medical College Hospital'],
    },
    'joint pain': {
      problem: 'Joint Pain',
      causes: ['Arthritis (osteoarthritis, rheumatoid)', 'Injury or trauma', 'Overuse of joints', 'Gout', 'Inflammatory conditions'],
      effects: ['Reduced range of motion', 'Difficulty with daily activities', 'Muscle weakness around joint', 'Sleep disruption', 'Decreased physical activity'],
      risks: ['Permanent joint damage', 'Chronic disability', 'Joint deformity', 'Loss of independence', 'Cardiovascular issues from inactivity'],
      symptoms: ['Joint swelling', 'Stiffness especially in morning', 'Pain during movement', 'Redness around joint', 'Warmth in the joint area'],
      doctor_type: 'Rheumatologist or Orthopedic Specialist',
      remedies: ['Apply warm compress', 'Gentle range-of-motion exercises', 'Maintain healthy weight', 'Use joint supports if needed', 'Anti-inflammatory diet'],
      medicines: ['Ibuprofen', 'Naproxen', 'Paracetamol', 'Topical diclofenac gel'],
      hospitals: ['Orthopedics department', 'Joint Replacement Centre', 'AIIMS Nagpur'],
    },
    'chest pain': {
      problem: 'Chest Pain',
      causes: ['Heart-related issues (angina)', 'Acid reflux or GERD', 'Muscle strain', 'Anxiety or panic attacks', 'Lung conditions'],
      effects: ['Anxiety and fear', 'Reduced physical activity', 'Breathing difficulty', 'Sleep disruption', 'Emergency situations'],
      risks: ['Heart attack', 'Cardiac arrest', 'Pulmonary embolism', 'Aortic dissection', 'Chronic heart disease'],
      symptoms: ['Pressure or tightness in chest', 'Pain radiating to arm or jaw', 'Shortness of breath', 'Sweating', 'Nausea', 'Dizziness'],
      doctor_type: 'Cardiologist',
      remedies: ['Seek immediate medical attention if severe', 'Rest in comfortable position', 'Practice deep breathing if anxiety-related', 'Avoid heavy meals', 'Manage stress levels'],
      medicines: ['Aspirin (if heart-related, seek emergency care)', 'Antacids (if acid reflux)', 'Nitroglycerin (if prescribed)'],
      hospitals: ['Cardiology department - EMERGENCY', 'Nagpur Heart Hospital', 'Wockhardt Hospital', 'AIIMS Nagpur'],
    },
    dizziness: {
      problem: 'Dizziness',
      causes: ['Inner ear problems (vertigo)', 'Low blood pressure', 'Dehydration', 'Low blood sugar', 'Medication side effects'],
      effects: ['Balance issues and fall risk', 'Nausea', 'Difficulty concentrating', 'Anxiety', 'Reduced ability to drive or work'],
      risks: ['Falls and injuries', 'Underlying neurological condition', 'Cardiovascular issues', 'Chronic vertigo', 'Stroke risk'],
      symptoms: ['Spinning sensation (vertigo)', 'Lightheadedness', 'Unsteadiness', 'Nausea', 'Blurred vision', 'Feeling faint'],
      doctor_type: 'ENT Specialist or Neurologist',
      remedies: ['Sit or lie down when dizzy', 'Stay hydrated', 'Avoid sudden position changes', 'Eat regular meals', 'Practice Epley maneuver for vertigo'],
      medicines: ['Meclizine for vertigo', 'Betahistine', 'Antihistamines', 'Consult doctor for underlying cause'],
      hospitals: ['ENT department', 'Neurology department', 'AIIMS Nagpur'],
    },
    fatigue: {
      problem: 'Fatigue',
      causes: ['Lack of quality sleep', 'Stress and mental health issues', 'Nutritional deficiencies (iron, B12)', 'Thyroid disorders', 'Chronic conditions'],
      effects: ['Reduced productivity', 'Poor concentration', 'Mood changes', 'Weakened immune system', 'Decreased physical performance'],
      risks: ['Chronic fatigue syndrome', 'Depression', 'Accidents from impaired alertness', 'Worsening of underlying conditions', 'Cardiovascular strain'],
      symptoms: ['Persistent tiredness', 'Lack of energy', 'Difficulty concentrating', 'Muscle weakness', 'Irritability', 'Frequent illness'],
      doctor_type: 'General Physician',
      remedies: ['Maintain consistent sleep schedule', 'Eat balanced nutritious meals', 'Regular moderate exercise', 'Manage stress through meditation', 'Stay hydrated'],
      medicines: ['Iron supplements (if anemic)', 'Vitamin B12 supplements', 'Vitamin D supplements', 'Consult doctor for underlying cause'],
      hospitals: ['General Medicine department', 'Government Medical College Hospital', 'AIIMS Nagpur'],
    },
  };

  // Find matching response
  for (const [key, value] of Object.entries(responses)) {
    if (q.includes(key)) return value;
  }

  // Default generic response
  return {
    problem: query,
    causes: ['Multiple potential causes - requires professional evaluation', 'Lifestyle factors may contribute', 'Genetic predisposition possible', 'Environmental factors'],
    effects: ['Varies based on underlying cause', 'May affect daily functioning', 'Could impact overall well-being', 'Professional assessment recommended'],
    risks: ['Condition may worsen without treatment', 'Potential for complications', 'Impact on quality of life', 'Early intervention is beneficial'],
    symptoms: ['Symptoms vary by individual', 'Professional diagnosis recommended', 'Monitor for changes', 'Keep a symptom diary'],
    doctor_type: 'General Physician (for initial consultation)',
    remedies: ['Consult a healthcare professional', 'Maintain a healthy lifestyle', 'Stay hydrated', 'Get adequate rest', 'Monitor symptoms'],
    medicines: ['Consult a doctor before taking any medication', 'Over-the-counter pain relievers if appropriate', 'Follow medical advice'],
    hospitals: ['Visit nearest multi-specialty hospital', 'Government Medical College Hospital Nagpur', 'AIIMS Nagpur'],
  };
}
