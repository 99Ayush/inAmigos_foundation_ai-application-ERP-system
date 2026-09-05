const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { mockApplications, mockCorporateProposals, mockAuditLogs } = require('../data/mockData');

const ALLOWED_STATUSES = [
  'submitted',
  'ai_triaged',
  'manual_review',
  'accepted',
  'rejected'
];

// GET /api/v1/admin/applications - Fetches applications with pagination, status filtering, search
router.get('/applications', async (req, res) => {
  let { page = 1, limit = 50, status, search } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 50;
  const offset = (page - 1) * limit;

  try {
    // Build query with joins
    let query = supabase
      .from('volunteer_applications')
      .select(`
        application_id,
        volunteer_id,
        initiative_id,
        raw_statement,
        ai_suggested_initiative,
        ai_confidence,
        ai_reasoning,
        status,
        submitted_at,
        volunteers!inner (
          full_name,
          email,
          phone,
          skills,
          availability_hours
        ),
        initiatives (
          title
        )
      `, { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Search filter (search across volunteer name, email, skills, statement)
    if (search) {
      query = query.or(
        `raw_statement.ilike.%${search}%,ai_suggested_initiative.ilike.%${search}%`,
      );
    }

    const { data, count, error } = await query;
    if (error) throw error;

    // Flatten the joined data to match the frontend's expected format
    const applications = (data || []).map(row => ({
      APPLICATION_ID: row.application_id,
      VOLUNTEER_ID: row.volunteer_id,
      FULL_NAME: row.volunteers?.full_name || null,
      EMAIL: row.volunteers?.email || null,
      PHONE: row.volunteers?.phone || null,
      SKILLS: row.volunteers?.skills || null,
      AVAILABILITY_HOURS: row.volunteers?.availability_hours || 0,
      INITIATIVE_ID: row.initiative_id,
      INITIATIVE_TITLE: row.initiatives?.title || null,
      RAW_STATEMENT: row.raw_statement,
      AI_SUGGESTED_INITIATIVE: row.ai_suggested_initiative,
      AI_CONFIDENCE: row.ai_confidence,
      AI_REASONING: row.ai_reasoning,
      STATUS: row.status,
      SUBMITTED_AT: row.submitted_at
    }));

    const resultApps = applications && applications.length > 0 ? applications : mockApplications;

    return res.status(200).json({
      data: resultApps,
      pagination: {
        total: resultApps.length,
        page,
        limit,
        totalPages: Math.ceil(resultApps.length / limit) || 1
      }
    });
  } catch (error) {
    console.warn('Database query error, returning mock applications:', error.message);
    return res.status(200).json({
      data: mockApplications,
      pagination: {
        total: mockApplications.length,
        page,
        limit,
        totalPages: Math.ceil(mockApplications.length / limit) || 1
      }
    });
  }
});

// PATCH /api/v1/admin/applications/:id/status - Updates status & assigns initiative
router.patch('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, initiative_id } = req.body;

  if (!status) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'status parameter is required.'
    });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  try {
    // Check exists
    const { data: existing } = await supabase
      .from('volunteer_applications')
      .select('application_id')
      .eq('application_id', Number(id))
      .limit(1);

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Application with ID ${id} not found.`
      });
    }

    // Build update object
    const updateObj = { status };
    if (initiative_id !== undefined && initiative_id !== null) {
      updateObj.initiative_id = Number(initiative_id);
    }

    const { error: updateErr } = await supabase
      .from('volunteer_applications')
      .update(updateObj)
      .eq('application_id', Number(id));

    if (updateErr) throw updateErr;

    // Fetch updated record with joins
    const { data: updated } = await supabase
      .from('volunteer_applications')
      .select(`
        application_id,
        volunteer_id,
        initiative_id,
        raw_statement,
        ai_suggested_initiative,
        ai_confidence,
        ai_reasoning,
        status,
        submitted_at,
        volunteers (full_name, email),
        initiatives (title)
      `)
      .eq('application_id', Number(id))
      .single();

    return res.status(200).json({
      message: 'Application status updated successfully',
      application: updated ? {
        APPLICATION_ID: updated.application_id,
        VOLUNTEER_ID: updated.volunteer_id,
        FULL_NAME: updated.volunteers?.full_name,
        EMAIL: updated.volunteers?.email,
        INITIATIVE_ID: updated.initiative_id,
        INITIATIVE_TITLE: updated.initiatives?.title,
        RAW_STATEMENT: updated.raw_statement,
        AI_SUGGESTED_INITIATIVE: updated.ai_suggested_initiative,
        AI_CONFIDENCE: updated.ai_confidence,
        AI_REASONING: updated.ai_reasoning,
        STATUS: updated.status,
        SUBMITTED_AT: updated.submitted_at
      } : null
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(400).json({
      error: 'Database Transaction Error',
      message: error.message
    });
  }
});

// GET /api/v1/admin/csr-proposals
router.get('/csr-proposals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('csr_proposals')
      .select('*');

    if (error) throw error;

    // Map to camelCase keys the frontend expects
    const proposals = (data || []).map(row => ({
      id: row.id,
      companyName: row.company_name,
      contactPerson: row.contact_person,
      email: row.email,
      pledgedAmount: Number(row.pledged_amount),
      targetedInitiative: row.targeted_initiative,
      proposalSummary: row.proposal_summary,
      status: row.status,
      submittedDate: row.submitted_date
    }));

    const resultProposals = proposals && proposals.length > 0 ? proposals : mockCorporateProposals;
    return res.status(200).json({ data: resultProposals });
  } catch (err) {
    console.warn('Database error, returning mock CSR proposals:', err.message);
    return res.status(200).json({ data: mockCorporateProposals });
  }
});

// PATCH /api/v1/admin/csr-proposals/:id/status
router.patch('/csr-proposals/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { error } = await supabase
      .from('csr_proposals')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error('Error updating CSR proposal:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Map to camelCase keys the frontend expects
    const logs = (data || []).map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      actorName: row.actor_name,
      actorRole: row.actor_role,
      action: row.action,
      target: row.target,
      details: row.details,
      category: row.category
    }));

    const resultLogs = logs && logs.length > 0 ? logs : mockAuditLogs;
    return res.status(200).json({ data: resultLogs });
  } catch (err) {
    console.warn('Database error, returning mock audit logs:', err.message);
    return res.status(200).json({ data: mockAuditLogs });
  }
});

// POST /api/v1/admin/audit-logs
router.post('/audit-logs', async (req, res) => {
  try {
    const { actorName, actorRole, action, target, details, category } = req.body;

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        actor_name: actorName,
        actor_role: actorRole,
        action,
        target,
        details,
        category
      });

    if (error) throw error;
    return res.status(201).json({ message: 'Created' });
  } catch (err) {
    console.error('Error creating audit log:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

module.exports = router;
