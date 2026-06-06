import analysesModel from '../model/analyses.Model.js';
import conversationModel from '../model/conversation.Model.js';
import { askJSON } from '../service/llmService.js';
import pool from '../config/postgre.js';

const PARSE_JD_SYSTEM = `
You are a job description analyzer for ATS optimization.
Extract key data from the job description. Return ONLY valid JSON, no markdown.
Schema: { "title": "", "company": "", "required_skills": [], "nice_to_have_skills": [], "ats_keywords": [], "responsibilities": [], "min_years_experience": null, "seniority": "", "tech_stack": [], "soft_skills": [] }
`.trim();

const MATCH_SCORE_SYSTEM = `
You are an ATS expert. Compare the resume against the job description and score the match.
Return ONLY valid JSON, no markdown.
Schema: { "score": 0, "matched_skills": [], "missing_keywords": [], "strengths": [], "weaknesses": [], "suggestions": [{ "area": "", "tip": "" }] }
`.trim();

const OPTIMIZE_RESUME_SYSTEM = `
You are an expert resume writer. Rewrite the resume bullets to naturally include missing keywords.
Keep all content truthful. Use strong action verbs. Return ONLY valid JSON, no markdown.
Schema: { "summary": "", "experience": [{ "company": "", "title": "", "start": "", "end": "", "bullets": [] }], "skills": [] }
`.trim();



export const runAnalysis = async (req, res) => {
  const { profileId, jobDescId } = req.body;
  const userId = req.user.userId;

  if (!profileId || !jobDescId) {
    return res.status(400).json({ message: 'profileId and jobDescId are required' });
  }

  try {
    const profileResult = await pool.query(
      'SELECT resume_data FROM profiles WHERE id = $1 AND user_id = $2',
      [profileId, userId]
    );
    const jdResult = await pool.query(
      'SELECT * FROM job_descriptions WHERE id = $1 AND user_id = $2',
      [jobDescId, userId]
    );

    if (!profileResult.rows[0]) return res.status(404).json({ message: 'Profile not found' });
    if (!jdResult.rows[0])      return res.status(404).json({ message: 'Job description not found' });

    const resumeData = profileResult.rows[0].resume_data;
    const jd         = jdResult.rows[0];

    let analysisRow = await analysesModel.getAnalysis(profileId, jobDescId);

    let jdAnalysis = jd.extracted_data;

    if (!jdAnalysis) {
      console.log('[Analysis] Step 1: Parsing JD...');
      const { data, model } = await askJSON(PARSE_JD_SYSTEM, `Job Description:\n${jd.description}`);
      jdAnalysis = data;

      // Save to job_descriptions so same JD never re-parses
      await pool.query(
        'UPDATE job_descriptions SET extracted_data = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(jdAnalysis), jd.id]
      );

      await conversationModel.saveConversation(
        userId, profileId, jobDescId,
        `Parse JD: ${jd.title} at ${jd.company_name}`,
        JSON.stringify(jdAnalysis),
        model, null
      );
      console.log('[Analysis] Step 1: Saved ✓');
    } else {
      console.log('[Analysis] Step 1: Using cache ✓');
    }

    let matchData = analysisRow?.match_data;

    if (!matchData) {
      console.log('[Analysis] Step 2: Scoring match...');
      const { data, model } = await askJSON(
        MATCH_SCORE_SYSTEM,
        `Resume:\n${JSON.stringify(resumeData)}\n\nJob Analysis:\n${JSON.stringify(jdAnalysis)}`
      );
      matchData = data;

      analysisRow = await analysesModel.saveAnalysis({
        userId, profileId, jobDescId,
        score: matchData.score,
        matchData,
        jdAnalysis,
        modelUsed: model
      });

      await conversationModel.saveConversation(
        userId, profileId, jobDescId,
        `Match score for: ${jd.title} at ${jd.company_name}`,
        JSON.stringify({ score: matchData.score, missing: matchData.missing_keywords }),
        model, null
      );
      console.log('[Analysis] Step 2: Saved ✓');
    } else {
      console.log('[Analysis] Step 2: Using cache ✓');
    }

    let optimizedContent = analysisRow?.optimized_content;

    if (!optimizedContent) {
      console.log('[Analysis] Step 3: Optimizing resume...');
      const { data, model } = await askJSON(
        OPTIMIZE_RESUME_SYSTEM,
        `Original Resume:\n${JSON.stringify(resumeData)}\nMissing Keywords:\n${JSON.stringify(matchData.missing_keywords)}\nJob Requirements:\n${JSON.stringify(jdAnalysis)}`
      );
      optimizedContent = data;

      await analysesModel.saveAnalysis({
        userId, profileId, jobDescId,
        score: matchData.score,
        matchData,
        jdAnalysis,
        optimizedContent,
        modelUsed: model
      });

      await conversationModel.saveConversation(
        userId, profileId, jobDescId,
        `Optimize resume for: ${jd.title} at ${jd.company_name}`,
        JSON.stringify(optimizedContent),
        model, null
      );
      console.log('[Analysis] Step 3: Saved ✓');
    } else {
      console.log('[Analysis] Step 3: Using cache ✓');
    }

    return res.status(200).json({
      message: 'Analysis complete',
      analysis: {
        id:               analysisRow.id,
        score:            matchData.score,
        matched_skills:   matchData.matched_skills,
        missing_keywords: matchData.missing_keywords,
        strengths:        matchData.strengths,
        weaknesses:       matchData.weaknesses,
        suggestions:      matchData.suggestions,
        optimized_resume: optimizedContent,
        job_analysis:     jdAnalysis
      }
    });

  } catch (error) {
    console.error('[Analysis] Error:', error.message);
    return res.status(500).json({ message: error.message || 'Analysis failed' });
  }
};


export const getAllAnalyses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const analyses = await analysesModel.getAnalysesByUser(userId);

    res.status(200).json({
      message: 'Analyses fetched',
      count: analyses.length,
      analyses
    });
  } catch (error) {
    console.error('Error in getAllAnalyses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAnalysisById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id }  = req.params;

    const analysis = await analysesModel.getAnalysisById(id, userId);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json({
      message: 'Analysis fetched',
      analysis
    });
  } catch (error) {
    console.error('Error in getAnalysisById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteAnalysis = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id }  = req.params;

    const deleted = await analysesModel.deleteAnalysis(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json({ message: 'Analysis deleted' });
  } catch (error) {
    console.error('Error in deleteAnalysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
};