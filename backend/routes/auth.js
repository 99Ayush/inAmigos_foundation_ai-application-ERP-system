const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/v1/auth - Single endpoint for Login and Signup
router.post('/', async (req, res) => {
  const { action = 'login', email, password, username, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Email and password are required fields.'
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // 1. Check Admin Credentials (hardcoded)
  if (cleanEmail === 'admin@inamigos.org' && password === 'admin123') {
    return res.status(200).json({
      message: 'Admin authentication successful',
      user: {
        email: cleanEmail,
        name: 'Admin TPO',
        role: 'ADMIN'
      }
    });
  }

  // 2. Partner Credentials (hardcoded)
  if (cleanEmail === 'partner@inamigos.org' && password === 'partner123') {
    return res.status(200).json({
      message: 'Partner authentication successful',
      user: {
        email: cleanEmail,
        name: 'InAmigos Partner Admin',
        role: 'PARTNER'
      }
    });
  }

  try {
    if (action === 'signup') {
      // Signup Workflow
      const fullName = username || 'Volunteer Candidate';

      // Check if volunteer already exists
      const { data: existing } = await supabase
        .from('volunteers')
        .select('volunteer_id')
        .eq('email', cleanEmail)
        .limit(1);

      let volunteer_id;
      if (existing && existing.length > 0) {
        volunteer_id = existing[0].volunteer_id;
      } else {
        // Insert new volunteer
        const { data: inserted, error: insErr } = await supabase
          .from('volunteers')
          .insert({ full_name: fullName, email: cleanEmail })
          .select('volunteer_id')
          .single();

        if (insErr) throw insErr;
        volunteer_id = inserted.volunteer_id;
      }

      return res.status(200).json({
        message: 'Signup successful',
        user: {
          email: cleanEmail,
          name: fullName,
          role: role || 'VOLUNTEER',
          volunteer_id
        }
      });
    } else {
      // Login Workflow — look up volunteer by email
      const { data: volData } = await supabase
        .from('volunteers')
        .select('volunteer_id, full_name')
        .eq('email', cleanEmail)
        .limit(1);

      let fullName = username || 'Volunteer Candidate';
      let volunteer_id = null;

      if (volData && volData.length > 0) {
        fullName = volData[0].full_name || fullName;
        volunteer_id = volData[0].volunteer_id;
      }

      return res.status(200).json({
        message: 'Login successful',
        user: {
          email: cleanEmail,
          name: fullName,
          role: role || 'VOLUNTEER',
          volunteer_id
        }
      });
    }
  } catch (error) {
    console.error('Auth endpoint error:', error);
    return res.status(500).json({
      error: 'Authentication Error',
      message: error.message
    });
  }
});

module.exports = router;
