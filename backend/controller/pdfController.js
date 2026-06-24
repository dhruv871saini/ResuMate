
import puppeteer from 'puppeteer';
import cloudinary from '../config/cloudinary.js';
import analysesModel from '../model/analyses.Model.js';
import { classicTemplate }   from '../service/templates/classic.js';
import { modernTemplate }    from '../service/templates/modern.js';
import { minimalTemplate }   from '../service/templates/minimal.js';
import { executiveTemplate } from '../service/templates/executive.js';

const TEMPLATES = {
  classic:   classicTemplate,
  modern:    modernTemplate,
  minimal:   minimalTemplate,
  executive: executiveTemplate,
};

export const AVAILABLE_TEMPLATES = Object.keys(TEMPLATES);

export const generateAndUploadPDF = async (req, res) => {
  const { analysisId, template = 'classic' } = req.body;
  const userId = req.user.userId;

  if (!AVAILABLE_TEMPLATES.includes(template)) {
    return res.status(400).json({
      message: `Invalid template. Choose: ${AVAILABLE_TEMPLATES.join(', ')}`
    });
  }

  try {
    const analysis = await analysesModel.getAnalysisById(analysisId, userId);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    if (!analysis.optimized_content)
      return res.status(400).json({ message: 'Run full analysis first (resume not optimized yet)' });

    const resumeData = analysis.optimized_content;

    const templateFn = TEMPLATES[template];
    const html = templateFn(resumeData);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    let pdfBuffer;
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
    } finally {
      await browser.close();
    }

    const safeName = (resumeData.name || 'resume')
      .replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder:        `resumate/resumes/${userId}`,
          public_id:     `${safeName}_${template}_${Date.now()}`,
          resource_type: 'raw',
          format:        'pdf',
          overwrite:     false,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      uploadStream.end(pdfBuffer);
    });

    const pdfUrl = cloudinaryResult.secure_url;

    await analysesModel.savePdfUrl(analysisId, userId, pdfUrl, template);

    console.log(`[PDF] Uploaded: ${pdfUrl}`);

    return res.status(200).json({
      message: 'PDF generated and uploaded',
      pdfUrl,
      template,
      analysisId,
    });

  } catch (error) {
    console.error('[PDF] Error:', error.message);
    return res.status(500).json({ message: error.message || 'PDF generation failed' });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await analysesModel.getResumesByUser(req.user.userId);
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error('[PDF] getMyResumes error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch resumes' });
  }
};

export const getTemplates = (_req, res) => {
  res.status(200).json({
    templates: [
      { id: 'classic',   label: 'Classic',   description: 'Single column, dark header. Best ATS score.' },
      { id: 'modern',    label: 'Modern',    description: 'Two column with purple sidebar. Popular.' },
      { id: 'minimal',   label: 'Minimal',   description: 'Whitespace-heavy, serif font. Clean look.' },
      { id: 'executive', label: 'Executive', description: 'Teal accent header. Great for senior roles.' },
    ]
  });
};