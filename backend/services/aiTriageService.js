const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config();

const FALLBACK_TRIAGE = {
  recommended_project: 'General Operations',
  extracted_skills: [],
  match_confidence: 0.00,
  summary_reasoning: 'AI Triage API unavailable or evaluation timed out. Flagged for manual review.',
  is_fallback: true
};

const PROJECT_ENUM = [
  'Project Bachpanshala',
  'Project Jeev',
  'Project Seva',
  'Project Prakriti',
  'Project Udaan',
  'General Operations'
];

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    recommended_project: {
      type: Type.STRING,
      enum: PROJECT_ENUM
    },
    extracted_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    match_confidence: { type: Type.NUMBER },
    summary_reasoning: { type: Type.STRING }
  },
  required: ['recommended_project', 'extracted_skills', 'match_confidence', 'summary_reasoning']
};

/**
 * Evaluates volunteer application statement & skills using Google Gemini API structured output.
 * @param {Object} input - { raw_statement, skills }
 * @param {number} timeoutMs - Max duration in ms before triggering fallback (default: 5000ms)
 * @returns {Promise<Object>} Triaged JSON result
 */
async function triageVolunteerApplication({ raw_statement, skills }, timeoutMs = 5000) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || process.env.SIMULATE_GEMINI_FAIL === 'true') {
    return FALLBACK_TRIAGE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Applicant Skills: ${skills || 'None provided'}\nApplicant Raw Statement: ${raw_statement}`;

    const apiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an AI Volunteer Triage Evaluator for InAmigos Foundation. Analyze the applicant\'s statement and skills. If the statement is gibberish, spam, nonsensical, or lacks actionable information, set match_confidence below 0.40, set recommended_project to "General Operations", and state why in summary_reasoning. Otherwise, pick the best matching initiative and output a match_confidence between 0.50 and 1.00.',
        responseMimeType: 'application/json',
        responseSchema
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API request timed out')), timeoutMs)
    );

    const response = await Promise.race([apiPromise, timeoutPromise]);

    if (!response || !response.text) {
      return FALLBACK_TRIAGE;
    }

    const parsed = JSON.parse(response.text);

    // Validate fields
    if (!PROJECT_ENUM.includes(parsed.recommended_project)) {
      parsed.recommended_project = 'General Operations';
    }

    parsed.match_confidence = typeof parsed.match_confidence === 'number' ? parsed.match_confidence : 0.0;
    parsed.is_fallback = false;

    return parsed;
  } catch (error) {
    console.warn('Gemini Triage API error/fallback:', error.message);
    return FALLBACK_TRIAGE;
  }
}

module.exports = {
  triageVolunteerApplication,
  FALLBACK_TRIAGE,
  PROJECT_ENUM
};
