const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { triageVolunteerApplication } = require('../services/aiTriageService');

// POST /api/v1/volunteers/apply - Creates/reuses volunteer record and inserts application with AI Triage
router.post('/apply', async (req, res) => {
  const {
    full_name,
    email,
    phone,
    skills,
    availability_hours,
    raw_statement,
    initiative_id
  } = req.body;

  let {
    ai_suggested_initiative,
    ai_confidence,
    ai_reasoning,
    status
  } = req.body;

  // Validation
  if (!full_name || !email || !raw_statement) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'full_name, email, and raw_statement are required fields.'
    });
  }

  // Execute AI Triage if metrics not pre-supplied
  let triageResult = null;
  if (!ai_suggested_initiative) {
    triageResult = await triageVolunteerApplication({ raw_statement, skills });
    ai_suggested_initiative = triageResult.recommended_project;
    ai_confidence = triageResult.match_confidence;
    ai_reasoning = triageResult.summary_reasoning;

    if (triageResult.is_fallback || ai_confidence < 0.50 || ai_suggested_initiative === 'General Operations') {
      status = 'manual_review';
    } else {
      status = status || 'ai_triaged';
    }
  } else {
    status = status || 'submitted';
  }

  try {
    // 1. Find or create volunteer
    const { data: existingVol } = await supabase
      .from('volunteers')
      .select('volunteer_id')
      .eq('email', email)
      .limit(1);

    let volunteer_id;
    if (existingVol && existingVol.length > 0) {
      volunteer_id = existingVol[0].volunteer_id;
      // Update volunteer profile
      await supabase
        .from('volunteers')
        .update({
          phone: phone || undefined,
          skills: skills || undefined,
          availability_hours: availability_hours !== undefined ? Number(availability_hours) : undefined
        })
        .eq('volunteer_id', volunteer_id);
    } else {
      // Insert new volunteer
      const { data: newVol, error: volErr } = await supabase
        .from('volunteers')
        .insert({
          full_name,
          email,
          phone: phone || null,
          skills: skills || null,
          availability_hours: availability_hours !== undefined ? Number(availability_hours) : 0
        })
        .select('volunteer_id')
        .single();

      if (volErr) throw volErr;
      volunteer_id = newVol.volunteer_id;
    }

    // 2. Match initiative_id if not provided
    let finalInitiativeId = initiative_id ? Number(initiative_id) : null;
    if (!finalInitiativeId && ai_suggested_initiative && status === 'ai_triaged') {
      const { data: initMatch } = await supabase
        .from('initiatives')
        .select('initiative_id')
        .eq('title', ai_suggested_initiative)
        .limit(1);

      if (initMatch && initMatch.length > 0) {
        finalInitiativeId = initMatch[0].initiative_id;
      }
    }

    // 3. Insert application
    const { data: newApp, error: appErr } = await supabase
      .from('volunteer_applications')
      .insert({
        volunteer_id,
        initiative_id: finalInitiativeId,
        raw_statement,
        ai_suggested_initiative: ai_suggested_initiative || null,
        ai_confidence: ai_confidence !== undefined && ai_confidence !== null ? Number(ai_confidence) : null,
        ai_reasoning: ai_reasoning || null,
        status: status || 'submitted'
      })
      .select('application_id')
      .single();

    if (appErr) throw appErr;

    return res.status(201).json({
      message: status === 'manual_review'
        ? 'Application flagged for manual review due to low match confidence.'
        : 'Application submitted and triaged successfully',
      application_id: newApp.application_id,
      volunteer_id,
      status,
      ai_triage: {
        ai_suggested_initiative,
        ai_confidence,
        ai_reasoning,
        initiative_id: finalInitiativeId
      }
    });
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    return res.status(400).json({
      error: 'Database Transaction Error',
      message: error.message
    });
  }
});

module.exports = router;
